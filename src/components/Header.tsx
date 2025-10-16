import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../lib/store'
import { LogOut, User, Settings, Menu, X, Clock, Bot } from 'lucide-react'
import { useState } from 'react'

export const Header = () => {
  const { user, userProfile, signOut } = useAuthStore()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-lg">Y</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">YaoTools</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/tools"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              工具中心
            </Link>
            <Link
              to="/ai-assistant"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <Bot className="h-4 w-4 mr-1" />
              AI助手
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              关于我们
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-primary-600 p-2"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Desktop user menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="text-sm">
                  <span className="text-gray-500">剩余次数: </span>
                  <span className="font-medium text-primary-600">
                    {userProfile?.remaining_uses ?? 0}
                  </span>
                </div>
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-primary-600">
                    <User className="h-5 w-5" />
                    <span className="text-sm">{userProfile?.username || user.email}</span>
                  </button>
                  <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      个人中心
                    </Link>
                    <Link
                      to="/usage-history"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      使用历史
                    </Link>
                    <Link
                      to="/redeem"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      兑换授权码
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      退出登录
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  登录
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  注册
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-3 space-y-3">
            {/* Navigation links */}
            <Link
              to="/tools"
              className="block text-gray-700 hover:text-primary-600 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              工具中心
            </Link>
            <Link
              to="/ai-assistant"
              className="flex items-center text-gray-700 hover:text-primary-600 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Bot className="h-4 w-4 mr-2" />
              AI助手
            </Link>
            
            {user ? (
              <>
                <div className="py-2 border-b border-gray-200">
                  <div className="text-sm text-gray-500">
                    {userProfile?.username || user.email}
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">剩余次数: </span>
                    <span className="font-medium text-primary-600">
                      {userProfile?.remaining_uses ?? 0}
                    </span>
                  </div>
                </div>
                <Link
                  to="/profile"
                  className="flex items-center py-2 text-gray-700 hover:text-primary-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  个人中心
                </Link>
                <Link
                  to="/usage-history"
                  className="flex items-center py-2 text-gray-700 hover:text-primary-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  使用历史
                </Link>
                <Link
                  to="/redeem"
                  className="block py-2 text-gray-700 hover:text-primary-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  兑换授权码
                </Link>
                <button
                  onClick={() => {
                    handleSignOut()
                    setMobileMenuOpen(false)
                  }}
                  className="flex items-center w-full py-2 text-gray-700 hover:text-primary-600"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  退出登录
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block py-2 text-gray-700 hover:text-primary-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  登录
                </Link>
                <Link
                  to="/register"
                  className="block py-2 bg-primary-600 text-white text-center rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  注册
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}