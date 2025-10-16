import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export type UserRole = 'user' | 'admin' | 'super_admin'
export type ToolType = 'code' | 'external'

export interface User {
  id: string
  email: string
  username?: string
  full_name?: string
  avatar_url?: string
  remaining_uses: number
  is_premium: boolean
  is_active: boolean
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Tool {
  id: string
  name: string
  description?: string
  category: string
  required_role: UserRole
  code_url: string // 数据库中为必填字段
  tool_type?: ToolType
  html_code?: string
  css_code?: string
  js_code?: string
  is_sandbox?: boolean
  is_active: boolean
  usage_count: number
  created_at: string
  updated_at: string
}

export interface UsageLog {
  id: string
  user_id: string
  tool_id: string
  created_at: string
  tools?: {
    name: string
    category: string
  }
}

export interface AuthCode {
  id: string
  code: string
  uses_to_add: number
  is_used: boolean
  is_permanent: boolean
  used_by?: string
  created_by?: string
  created_at: string
  used_at?: string
}

export interface AdminLog {
  id: string
  admin_id: string
  action: string
  target_type?: string
  target_id?: string
  details?: any
  created_at: string
}

export interface AIModel {
  id: string
  name: string
  model_name: string
  api_url: string
  api_key: string
  description?: string
  max_tokens?: number
  temperature?: number
  is_active: boolean
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface ChatMessage {
  id: string
  user_id: string
  model_id: string
  user_message: string
  ai_response: string
  tokens_used?: number
  created_at: string
}
