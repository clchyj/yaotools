import { useState } from 'react'
import { Layout } from '../components/Layout'
import { 
  Mail, 
  MessageCircle, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  CheckCircle,
  AlertCircle,
  User,
  FileText
} from 'lucide-react'

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      // 这里应该连接到实际的邮件发送服务
      await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟API调用
      
      setSuccess(true)
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        type: 'general'
      })
    } catch (err) {
      setError('发送失败，请重试或通过其他方式联系我们')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <Layout>
      <div className="bg-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-6">联系我们</h1>
              <p className="text-xl opacity-90 max-w-3xl mx-auto">
                我们随时为您提供帮助。选择最适合您的联系方式，我们会尽快回复
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">联系方式</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Mail className="h-6 w-6 text-primary-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">邮箱</h3>
                      <p className="text-gray-600 mt-1">clchyj@163.com</p>
                      <p className="text-sm text-gray-500 mt-1">24小时内回复</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <MessageCircle className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">微信客服</h3>
                      <p className="text-gray-600 mt-1">clchyj</p>
                      <p className="text-sm text-gray-500 mt-1">工作时间在线</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Phone className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">客服电话</h3>
                      <p className="text-gray-600 mt-1">13776914752</p>
                      <p className="text-sm text-gray-500 mt-1">工作时间：9:00-18:00</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <MapPin className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">办公地址</h3>
                      <p className="text-gray-600 mt-1">江苏南通</p>
                      <p className="text-gray-600">江苏南通</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Clock className="h-6 w-6 text-orange-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">工作时间</h3>
                      <p className="text-gray-600 mt-1">周一至周五：9:00-18:00</p>
                      <p className="text-gray-600">周末：10:00-16:00</p>
                      <p className="text-sm text-gray-500 mt-1">节假日休息</p>
                    </div>
                  </div>
                </div>

                {/* QR Code */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">扫码添加客服微信</h3>
                    <div className="bg-white p-4 rounded-lg border-2 border-gray-200 text-center">
                    <img src="/image/wechat.jpg" alt="微信客服二维码" className="w-32 h-32 mx-auto mb-3 rounded-lg border object-cover" />
                    <p className="text-sm text-gray-600">微信客服二维码</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-200 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">发送消息</h2>
                <p className="text-gray-600 mb-8">填写下表，我们会尽快回复您的问题</p>

                {success && (
                  <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    消息发送成功！我们会在24小时内回复您。
                  </div>
                )}

                {error && (
                  <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="h-4 w-4 inline mr-1" />
                        您的姓名
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="请输入您的姓名"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="h-4 w-4 inline mr-1" />
                        邮箱地址
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="请输入您的邮箱"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                      <FileText className="h-4 w-4 inline mr-1" />
                      问题类型
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="general">一般咨询</option>
                      <option value="technical">技术支持</option>
                      <option value="billing">账单问题</option>
                      <option value="feature">功能建议</option>
                      <option value="bug">错误报告</option>
                      <option value="partnership">合作洽谈</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      主题
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="请简述您的问题或需求"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      详细描述
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-vertical"
                      placeholder="请详细描述您的问题、建议或需求，我们会根据您的描述提供最合适的帮助..."
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      最少50个字符，最多1000个字符
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                        发送中...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        发送消息
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">常见问题</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                查看这些常见问题，或许能快速找到您需要的答案
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">如何获得更多使用次数？</h3>
                <p className="text-gray-600">
                  您可以通过兑换授权码、升级会员账户或联系客服获取更多使用次数。我们也会定期举办活动赠送使用次数。
                </p>
              </div>

              <div className="bg-white rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">工具使用时遇到错误怎么办？</h3>
                <p className="text-gray-600">
                  请尝试刷新页面或清除浏览器缓存。如果问题持续存在，请联系技术支持并详细描述错误情况。
                </p>
              </div>

              <div className="bg-white rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">数据安全如何保障？</h3>
                <p className="text-gray-600">
                  我们采用行业标准的加密技术保护您的数据，不会存储您的敏感信息，所有处理都在安全的环境中进行。
                </p>
              </div>

              <div className="bg-white rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">可以申请退款吗？</h3>
                <p className="text-gray-600">
                  我们提供7天无理由退款服务。如果您对我们的服务不满意，请在购买后7天内联系客服申请退款。
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <a
                href="/help"
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                查看更多帮助
              </a>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
}