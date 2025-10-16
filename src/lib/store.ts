import { create } from 'zustand'
import { supabase, type User } from './supabase'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface AuthState {
  user: SupabaseUser | null
  userProfile: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, username?: string) => Promise<void>
  signOut: () => Promise<void>
  fetchUserProfile: () => Promise<void>
  updateUsage: (decrement?: boolean) => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  userProfile: null,
  loading: true,

  signIn: async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  },

  signUp: async (email: string, password: string, username?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) throw error
    
    // User profile will be created automatically by the database trigger
    // If username is provided, update it after profile creation
    if (data.user && username) {
      // Wait a bit for trigger to complete
      setTimeout(async () => {
        try {
          await supabase
            .from('users')
            .update({ username })
            .eq('id', data.user!.id)
        } catch (err) {
          console.warn('Failed to update username:', err)
        }
      }, 1000)
    }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    set({ user: null, userProfile: null })
  },

  fetchUserProfile: async () => {
    const { user } = get()
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        // If user profile doesn't exist, create it
        if (error.code === 'PGRST116') {
          const { data: newProfile, error: insertError } = await supabase
            .from('users')
            .insert([{
              id: user.id,
              email: user.email,
              remaining_uses: 10,
              role: 'user',
              is_active: true
            }])
            .select()
            .single()
          
          if (insertError) {
            console.error('Error creating user profile:', insertError)
            return
          }
          set({ userProfile: newProfile })
        }
        return
      }
      
      set({ userProfile: data })
    } catch (err) {
      console.error('Unexpected error in fetchUserProfile:', err)
    }
  },

  updateUsage: async (decrement = true) => {
    const { user, userProfile } = get()
    if (!user || !userProfile) return

    const newUsage = decrement 
      ? Math.max(0, userProfile.remaining_uses - 1)
      : userProfile.remaining_uses + 1

    const { error } = await supabase
      .from('users')
      .update({ remaining_uses: newUsage })
      .eq('id', user.id)

    if (error) throw error
    
    set({
      userProfile: {
        ...userProfile,
        remaining_uses: newUsage,
      },
    })
  },
}))

// Initialize auth state
supabase.auth.onAuthStateChange((_event, session) => {
  useAuthStore.setState({
    user: session?.user ?? null,
    loading: false,
  })
  
  if (session?.user) {
    useAuthStore.getState().fetchUserProfile()
  } else {
    useAuthStore.setState({ userProfile: null })
  }
})