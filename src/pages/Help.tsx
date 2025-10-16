import { useState } from 'react'
import { Layout } from '../components/Layout'
import { 
  Search,
  Book,
  PlayCircle,
  HelpCircle,
  User,
  Settings,
  CreditCard,
  Shield,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  MessageCircle
} from 'lucide-react'

export const Help = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('getting-started')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const categories = [
    { id: 'getting-started', name: '快速入门', icon: PlayCircle },
    { id: 'account', name: '账户管理', icon: User },
    { id: 'tools', name: '工具使用', icon: Settings },
    { id: 'billing', name: '计费与订阅', icon: CreditCard },
    { id: 'security', name: '安全与隐私', icon: Shield },
    { id: 'troubleshooting', name: '问题排查', icon: HelpCircle }
  ]

  const helpContent = {
    'getting-started': [
      {
        title: '欢迎使用 YaoTools',
        content: '感谢选择 YaoTools！本指南将帮助您快速了解和使用我们的在线工具平台。',
        sections: [
          {
            title: '注册账户',
            content: '访问注册页面，填写邮箱和密码即可创建账户。注册后您将获得免费的使用次数。'
          },
          {
            title: '浏览工具',
            content: '在工具页面浏览所有可用的工具，可以按分类筛选或使用搜索功能找到需要的工具。'
          },
          {
            title: '开始使用',
            content: '选择工具后，按照界面提示输入内容或上传文件，点击处理按钮即可获得结果。'
          }
        ]
      }
    ],
    'account': [
      {
        title: '账户设置',
        content: '管理您的个人信息、密码和偏好设置。',
        sections: [
          {
            title: '修改个人信息',
            content: '在个人中心可以更新您的姓名、头像等基本信息。'
          },
          {
            title: '更改密码',
            content: '为了账户安全，建议定期更改密码。密码应包含字母、数字，长度至少8位。'
          },
          {
            title: '邮箱验证',
            content: '验证邮箱后可以接收重要通知和找回密码。请在注册后及时完成邮箱验证。'
          }
        ]
      }
    ],
    'tools': [
      {
        title: '工具使用指南',
        content: '了解如何有效使用我们提供的各种在线工具。',
        sections: [
          {
            title: '文本处理工具',
            content: '包括 JSON 格式化、二维码生成、文本转换等工具，支持批量处理和自定义参数。'
          },
          {
            title: '图片处理工具',
            content: '提供图片压缩、格式转换、尺寸调整等功能，支持多种图片格式。'
          },
          {
            title: '开发工具',
            content: '为开发者提供代码格式化、API 测试、加密解密等专业工具。'
          }
        ]
      }
    ],
    'billing': [
      {
        title: '计费说明',
        content: '了解我们的计费方式和订阅选项。',
        sections: [
          {
            title: '免费额度',
            content: '新用户注册后可获得免费使用次数，用完后可通过各种方式获得更多次数。'
          },
          {
            title: '授权码兑换',
            content: '使用授权码可以获得额外的使用次数，授权码可通过活动或购买获得。'
          },
          {
            title: '会员订阅',
            content: '升级为会员可享受更多使用次数、优先支持和专属功能。'
          }
        ]
      }
    ],
    'security': [
      {
        title: '安全与隐私',
        content: '我们重视您的数据安全和隐私保护。',
        sections: [
          {
            title: '数据加密',
            content: '所有数据传输都使用 HTTPS 加密，确保信息安全。'
          },
          {
            title: '隐私保护',
            content: '我们不会存储您的敏感数据，处理完成后立即清除。'
          },
          {
            title: '账户安全',
            content: '启用两步验证，定期检查登录记录，保护账户安全。'
          }
        ]
      }
    ],
    'troubleshooting': [
      {
        title: '常见问题解决',
        content: '遇到问题时的诊断和解决方法。',
        sections: [
          {
            title: '工具无法使用',
            content: '请检查网络连接，刷新页面，或尝试清除浏览器缓存。'
          },
          {
            title: '文件上传失败',
            content: '请确认文件大小不超过限制，格式正确，网络连接稳定。'
          },
          {
            title: '结果异常',
            content: '请检查输入数据格式是否正确，或联系技术支持获得帮助。'
          }
        ]
      }
    ]
  }

  const faqs = [
    {
      question: '如何获得更多使用次数？',
      answer: '您可以通过以下方式获得更多使用次数：1) 兑换授权码；2) 升级会员账户；3) 参与官方活动；4) 邀请好友注册；5) 联系客服购买。'
    },
    {
      question: '忘记密码怎么办？',
      answer: '在登录页面点击"忘记密码"，输入注册邮箱，我们会发送重置密码链接到您的邮箱。请注意检查垃圾邮件文件夹。'
    },
    {
      question: '支持哪些文件格式？',
      answer: '不同工具支持的格式不同。文档工具一般支持 PDF、DOCX、TXT；图片工具支持 JPG、PNG、GIF、WebP；具体支持格式请查看各工具的说明。'
    },
    {
      question: '文件大小有限制吗？',
      answer: '是的，为了保证服务质量，我们对上传文件大小有限制。普通用户单个文件限制 10MB，会员用户限制 50MB。'
    },
    {
      question: '工具处理需要多长时间？',
      answer: '大多数工具可以在几秒钟内完成处理。复杂任务可能需要几分钟。处理时间取决于文件大小、复杂度和当前服务负载。'
    },
    {
      question: '可以批量处理文件吗？',
      answer: '部分工具支持批量处理功能。会员用户享有更高的批量处理限额。具体支持情况请查看各工具的功能说明。'
    },
    {
      question: '如何联系技术支持？',
      answer: '您可以通过以下方式联系我们：1) 发送邮件至 support@yaotools.com；2) 使用页面右下角的在线客服；3) 微信客服：yaotools_support；4) 拨打客服电话 400-888-0001。'
    },
    {
      question: '账户被锁定怎么办？',
      answer: '如果您的账户被锁定，可能是由于多次登录失败或异常活动。请联系客服或发送邮件至 security@yaotools.com 申请解锁。'
    }
  ]

  const currentContent = helpContent[activeCategory as keyof typeof helpContent] || []

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Layout>
      <div className="bg-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-6">使用帮助</h1>
              <p className="text-xl opacity-90 max-w-3xl mx-auto">
                查找答案，学习使用技巧，让您的工作更加高效
              </p>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="搜索帮助内容、常见问题..."
                  className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">帮助分类</h2>
                <nav className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                        activeCategory === category.id
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <category.icon className="h-5 w-5 mr-3" />
                      {category.name}
                    </button>
                  ))}
                </nav>

                {/* Quick Links */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">快速链接</h3>
                  <div className="space-y-3">
                    <a
                      href="/contact"
                      className="flex items-center text-sm text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      联系客服
                    </a>
                    <a
                      href="/about"
                      className="flex items-center text-sm text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      <Book className="h-4 w-4 mr-2" />
                      关于我们
                    </a>
                    <a
                      href="mailto:support@yaotools.com"
                      className="flex items-center text-sm text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      发送邮件
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Help Articles */}
              <div className="mb-12">
                <div className="flex items-center mb-8">
                  <Book className="h-6 w-6 text-primary-600 mr-2" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    {categories.find(cat => cat.id === activeCategory)?.name}
                  </h2>
                </div>

                <div className="space-y-8">
                  {currentContent.map((article, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-xl p-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">{article.title}</h3>
                      <p className="text-gray-600 mb-6">{article.content}</p>
                      
                      <div className="space-y-6">
                        {article.sections.map((section, sectionIndex) => (
                          <div key={sectionIndex}>
                            <h4 className="text-lg font-medium text-gray-900 mb-2">{section.title}</h4>
                            <p className="text-gray-600 leading-relaxed">{section.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ Section */}
              <div>
                <div className="flex items-center mb-8">
                  <HelpCircle className="h-6 w-6 text-primary-600 mr-2" />
                  <h2 className="text-2xl font-bold text-gray-900">常见问题</h2>
                </div>

                <div className="space-y-4">
                  {filteredFaqs.map((faq, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-xl">
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                        className="w-full flex items-center justify-between p-6 text-left"
                      >
                        <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                        {expandedFaq === index ? (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-gray-500" />
                        )}
                      </button>
                      
                      {expandedFaq === index && (
                        <div className="px-6 pb-6">
                          <div className="pt-4 border-t border-gray-200">
                            <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {filteredFaqs.length === 0 && searchTerm && (
                  <div className="text-center py-12">
                    <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">未找到相关帮助内容</p>
                    <p className="text-sm text-gray-500 mt-2">
                      请尝试使用其他关键词搜索，或
                      <a href="/contact" className="text-primary-600 hover:text-primary-700 ml-1">
                        联系客服
                      </a>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">还有其他问题？</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              如果您没有找到想要的答案，我们的客服团队随时为您提供帮助
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                联系客服
              </a>
              <a
                href="mailto:support@yaotools.com"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-primary-600 text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
              >
                发送邮件
              </a>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
}