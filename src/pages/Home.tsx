import { Link } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { ArrowRight, Zap, Shield, Users } from 'lucide-react'

export const Home = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              专业的在线工具平台
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              YaoTools 提供丰富的在线工具，包括文本处理、图片编辑、文件转换等，
              帮助您提升工作效率，简化日常任务。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/tools"
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                开始使用
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/register"
                className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 rounded-lg font-medium transition-colors"
              >
                免费注册
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">为什么选择 YaoTools?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              我们致力于为用户提供最优质的在线工具体验
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">高效便捷</h3>
              <p className="text-gray-600">
                无需安装软件，打开浏览器即可使用各种专业工具，节省您的宝贵时间。
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">安全可靠</h3>
              <p className="text-gray-600">
                采用先进的安全技术，保护您的数据隐私，所有处理均在安全环境中进行。
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">用户优先</h3>
              <p className="text-gray-600">
                简洁直观的界面设计，专业的客户服务，让每个用户都能轻松上手。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              准备好提升您的工作效率了吗？
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              立即注册，免费试用我们的专业工具
            </p>
            <Link
              to="/register"
              className="bg-white hover:bg-gray-100 text-primary-600 px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center"
            >
              免费开始
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}