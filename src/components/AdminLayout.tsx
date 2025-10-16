import { useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../lib/store'
import { 
  LayoutDashboard, 
  Wrench, 
  Users, 
  Gift, 
  FileText,
  Menu, 
  X, 
  LogOut,
  Settings,
  Bot
} from 'lucide-react'

interface AdminLayoutProps {
  children: ReactNode
}

const menuItems = [
  {
    name: '仪表盘',
    href: '/admin',
    icon: LayoutDashboard,
    exact: true
  },
  {
    name: '工具管理',
    href: '/admin/tools',
    icon: Wrench
  },
  {
    name: 'AI模型管理',
    href: '/admin/ai-models',
    icon: Bot
  },
  {
    name: '用户管理',
    href: '/admin/users',
    icon: Users
  },
  {
    name: '授权码管理',
    href: '/admin/codes',
    icon: Gift
  },
  {
    name: '操作日志',
    href: '/admin/logs',
    icon: FileText
  }
]

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, userProfile, signOut } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const isCurrentPath = (href: string, exact = false) => {
    if (exact) {
      return location.pathname === href
    }
    return location.pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out`}>
        
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-600 rounded-md flex items-center justify-center">
              <Settings className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-900">管理后台</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Admin info */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 font-medium">
                {userProfile?.username?.[0] || user?.email?.[0] || 'A'}
              </span>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">
                {userProfile?.username || user?.email}
              </div>
              <div className="text-xs text-red-600">
                {userProfile?.role === 'super_admin' ? '超级管理员' : '管理员'}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const current = isCurrentPath(item.href, item.exact)
            
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`${
                  current
                    ? 'bg-red-50 border-red-200 text-red-700'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } group flex items-center px-3 py-2 text-sm font-medium border-l-4 transition-colors`}
              >
                <Icon
                  className={`${
                    current ? 'text-red-500' : 'text-gray-400 group-hover:text-gray-500'
                  } mr-3 h-5 w-5`}
                />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="border-t border-gray-200 p-4">
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-3 text-sm text-gray-600 hover:text-gray-900 w-full"
          >
            <LogOut className="h-4 w-4" />
            <span>退出登录</span>
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-25"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-500 hover:text-gray-700"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">管理后台</h1>
            <div></div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  )
}