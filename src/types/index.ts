export interface User {
  id: string
  email: string
  full_name?: string
  role: 'user' | 'premium' | 'admin' | 'super_admin'
  is_active: boolean
  remaining_uses: number
  created_at: string
  updated_at: string
}

export interface Tool {
  id: string
  name: string
  description: string
  category: string
  required_role: 'user' | 'premium' | 'admin' | 'super_admin'
  is_active: boolean
  html_code?: string
  css_code?: string
  js_code?: string
  created_at: string
  updated_at: string
}

export interface AuthCode {
  id: string
  code: string
  uses: number
  is_used: boolean
  used_by?: string
  created_at: string
  used_at?: string
}

export interface UsageLog {
  id: string
  user_id: string
  tool_id: string
  created_at: string
}

export interface AdminLog {
  id: string
  admin_id: string
  action: string
  target_type: string
  target_id?: string
  details?: Record<string, any>
  created_at: string
}