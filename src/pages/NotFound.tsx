import { Link } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { Home, ArrowLeft, Search, Wrench } from 'lucide-react'

export const NotFound = () => {
  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg w-full text-center">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="relative">
              <h1 className="text-9xl font-bold text-gray-200 select-none">404</h1>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                  <Wrench className="w-10 h-10 text-primary-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">页面未找到</h2>
            <p className="text-lg text-gray-600">
              抱歉，您访问的页面不存在或已被移动
            </p>
            <p className="text-sm text-gray-500">
              请检查URL是否正确，或者返回首页寻找您需要的内容
            </p>
          </div>

          {/* Action buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              <Home className="w-4 h-4 mr-2" />
              返回首页
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回上页
            </button>
            
            <Link
              to="/tools"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Search className="w-4 h-4 mr-2" />
              浏览工具
            </Link>
          </div>

          {/* Popular links */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-4">您可能感兴趣的</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <Link
                to="/tools"
                className="text-primary-600 hover:text-primary-500 hover:underline"
              >
                工具中心
              </Link>
              <Link
                to="/profile"
                className="text-primary-600 hover:text-primary-500 hover:underline"
              >
                个人中心
              </Link>
              <Link
                to="/redeem"
                className="text-primary-600 hover:text-primary-500 hover:underline"
              >
                兑换授权码
              </Link>
              <Link
                to="/about"
                className="text-primary-600 hover:text-primary-500 hover:underline"
              >
                关于我们
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}