import { Layout } from '../components/Layout'
import { Shield, Eye, Lock, Server, Globe, Users, AlertTriangle, Mail } from 'lucide-react'

export const Privacy = () => {
  return (
    <Layout>
      <div className="bg-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <Shield className="h-16 w-16 mx-auto mb-6 opacity-90" />
              <h1 className="text-5xl font-bold mb-6">隐私政策</h1>
              <p className="text-xl opacity-90 max-w-3xl mx-auto">
                我们重视并保护您的隐私。本政策详细说明我们如何收集、使用和保护您的个人信息
              </p>
              <p className="text-sm opacity-75 mt-4">最后更新：2024年10月15日</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Quick Overview */}
          <section className="mb-16">
            <div className="bg-primary-50 border border-primary-200 rounded-2xl p-8">
              <div className="flex items-center mb-6">
                <Eye className="h-8 w-8 text-primary-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">隐私保护承诺</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <Lock className="h-6 w-6 text-primary-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">数据加密</h3>
                    <p className="text-gray-600 text-sm mt-1">所有数据传输采用HTTPS加密</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Server className="h-6 w-6 text-primary-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">临时处理</h3>
                    <p className="text-gray-600 text-sm mt-1">文件处理后立即清除</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Globe className="h-6 w-6 text-primary-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">透明公开</h3>
                    <p className="text-gray-600 text-sm mt-1">隐私政策公开透明</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Users className="h-6 w-6 text-primary-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">用户控制</h3>
                    <p className="text-gray-600 text-sm mt-1">您完全控制自己的数据</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Table of Contents */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">目录</h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <ul className="space-y-2">
                <li><a href="#info-collect" className="text-primary-600 hover:text-primary-800">1. 我们收集的信息</a></li>
                <li><a href="#info-usage" className="text-primary-600 hover:text-primary-800">2. 信息的使用方式</a></li>
                <li><a href="#info-sharing" className="text-primary-600 hover:text-primary-800">3. 信息共享与披露</a></li>
                <li><a href="#data-security" className="text-primary-600 hover:text-primary-800">4. 数据安全保护</a></li>
                <li><a href="#data-retention" className="text-primary-600 hover:text-primary-800">5. 数据保存期限</a></li>
                <li><a href="#user-rights" className="text-primary-600 hover:text-primary-800">6. 您的权利</a></li>
                <li><a href="#cookies" className="text-primary-600 hover:text-primary-800">7. Cookie 和类似技术</a></li>
                <li><a href="#international" className="text-primary-600 hover:text-primary-800">8. 国际数据传输</a></li>
                <li><a href="#children" className="text-primary-600 hover:text-primary-800">9. 儿童隐私保护</a></li>
                <li><a href="#updates" className="text-primary-600 hover:text-primary-800">10. 政策更新</a></li>
                <li><a href="#contact" className="text-primary-600 hover:text-primary-800">11. 联系我们</a></li>
              </ul>
            </div>
          </section>

          {/* Content Sections */}
          <div className="space-y-12">
            <section id="info-collect">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">1. 我们收集的信息</h2>
              <div className="prose prose-lg text-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">1.1 您主动提供的信息</h3>
                <ul className="list-disc list-inside space-y-2 mb-6">
                  <li>账户注册信息：邮箱地址、用户名、密码</li>
                  <li>个人资料：姓名、头像、联系方式（可选）</li>
                  <li>联系信息：通过客服或反馈功能提供的信息</li>
                  <li>支付信息：订阅或购买服务时的支付相关信息</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">1.2 自动收集的信息</h3>
                <ul className="list-disc list-inside space-y-2 mb-6">
                  <li>设备信息：浏览器类型、操作系统、设备型号</li>
                  <li>使用数据：访问日志、使用的工具、操作记录</li>
                  <li>技术信息：IP地址、Cookie标识符</li>
                  <li>性能数据：加载时间、错误日志、使用统计</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">1.3 处理文件信息</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>上传的文件内容（仅用于提供工具服务）</li>
                  <li>处理过程中的临时数据</li>
                  <li>文件元数据（大小、格式、修改时间）</li>
                </ul>
              </div>
            </section>

            <section id="info-usage">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">2. 信息的使用方式</h2>
              <div className="prose prose-lg text-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">2.1 服务提供</h3>
                <ul className="list-disc list-inside space-y-2 mb-6">
                  <li>提供在线工具服务</li>
                  <li>处理您上传的文件</li>
                  <li>管理您的账户和订阅</li>
                  <li>响应您的支持请求</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">2.2 服务改进</h3>
                <ul className="list-disc list-inside space-y-2 mb-6">
                  <li>分析使用模式以改进服务</li>
                  <li>开发新功能和工具</li>
                  <li>优化性能和用户体验</li>
                  <li>进行安全监控和防护</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">2.3 通信联系</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>发送服务相关通知</li>
                  <li>响应客户支持请求</li>
                  <li>发送重要的账户信息</li>
                  <li>在获得同意后发送营销信息</li>
                </ul>
              </div>
            </section>

            <section id="info-sharing">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">3. 信息共享与披露</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
                <div className="flex items-start">
                  <AlertTriangle className="h-6 w-6 text-yellow-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-yellow-800 mb-2">重要声明</h3>
                    <p className="text-yellow-700">我们不会将您的个人信息出售、租赁或以其他方式商业化利用。</p>
                  </div>
                </div>
              </div>
              
              <div className="prose prose-lg text-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">3.1 不会共享的情况</h3>
                <ul className="list-disc list-inside space-y-2 mb-6">
                  <li>不向第三方出售个人信息</li>
                  <li>不用于未经授权的营销目的</li>
                  <li>不与数据经纪商共享</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">3.2 有限共享情况</h3>
                <ul className="list-disc list-inside space-y-2 mb-6">
                  <li>服务提供商：云存储、支付处理、客服系统</li>
                  <li>法律要求：政府部门依法要求时</li>
                  <li>安全保护：防止欺诈、滥用或非法活动</li>
                  <li>业务转让：在合并或收购时（需提前通知）</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">3.3 匿名化数据</h3>
                <p>我们可能会使用匿名化或聚合的数据进行研究、统计分析或改进服务，这些数据不会识别到个人。</p>
              </div>
            </section>

            <section id="data-security">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">4. 数据安全保护</h2>
              <div className="prose prose-lg text-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">4.1 技术保护措施</h3>
                <ul className="list-disc list-inside space-y-2 mb-6">
                  <li>HTTPS 加密传输</li>
                  <li>数据库加密存储</li>
                  <li>访问控制和权限管理</li>
                  <li>定期安全审计和漏洞扫描</li>
                  <li>多因素身份验证</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">4.2 物理保护措施</h3>
                <ul className="list-disc list-inside space-y-2 mb-6">
                  <li>服务器托管在安全的数据中心</li>
                  <li>24/7 监控和安保措施</li>
                  <li>备份和灾难恢复计划</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">4.3 员工培训</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>定期进行隐私和安全培训</li>
                  <li>最小权限原则</li>
                  <li>保密协议和行为准则</li>
                </ul>
              </div>
            </section>

            <section id="data-retention">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">5. 数据保存期限</h2>
              <div className="prose prose-lg text-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">5.1 账户数据</h3>
                <p className="mb-4">在您的账户处于活跃状态期间保存，账户删除后30天内完全清除。</p>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">5.2 处理文件</h3>
                <p className="mb-4">上传的文件在处理完成后立即删除，不会在服务器上长期保存。</p>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">5.3 日志数据</h3>
                <p className="mb-4">访问日志和使用统计保存90天，用于安全监控和服务改进。</p>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">5.4 支付记录</h3>
                <p>根据法律要求保存7年，用于财务记录和税务合规。</p>
              </div>
            </section>

            <section id="user-rights">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">6. 您的权利</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">访问权</h3>
                  <p className="text-gray-600">您有权了解我们收集的关于您的个人信息。</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">更正权</h3>
                  <p className="text-gray-600">您可以要求更正不准确或不完整的个人信息。</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">删除权</h3>
                  <p className="text-gray-600">您可以要求删除您的个人信息（在某些条件下）。</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">可携带权</h3>
                  <p className="text-gray-600">您可以要求以结构化格式获取您的数据。</p>
                </div>
              </div>
            </section>

            <section id="cookies">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">7. Cookie 和类似技术</h2>
              <div className="prose prose-lg text-gray-600">
                <p className="mb-4">我们使用 Cookie 和类似技术来改善您的使用体验：</p>
                <ul className="list-disc list-inside space-y-2 mb-6">
                  <li><strong>必要Cookie</strong>：确保网站基本功能正常运行</li>
                  <li><strong>分析Cookie</strong>：了解网站使用情况和性能</li>
                  <li><strong>功能Cookie</strong>：记住您的偏好和设置</li>
                  <li><strong>安全Cookie</strong>：防止欺诈和保护账户安全</li>
                </ul>
                <p>您可以通过浏览器设置控制 Cookie 的使用，但禁用某些 Cookie 可能影响网站功能。</p>
              </div>
            </section>

            <section id="children">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">9. 儿童隐私保护</h2>
              <div className="prose prose-lg text-gray-600">
                <p className="mb-4">我们的服务主要面向成年用户。我们不会故意收集13岁以下儿童的个人信息。</p>
                <p>如果您发现儿童向我们提供了个人信息，请立即联系我们，我们将及时删除相关信息。</p>
              </div>
            </section>

            <section id="updates">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">10. 政策更新</h2>
              <div className="prose prose-lg text-gray-600">
                <p className="mb-4">我们可能会不时更新本隐私政策。重大变更时，我们会：</p>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li>在网站显著位置发布通知</li>
                  <li>通过邮件通知注册用户</li>
                  <li>提供至少30天的过渡期</li>
                </ul>
                <p>继续使用我们的服务即表示您接受更新后的隐私政策。</p>
              </div>
            </section>

            <section id="contact">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">11. 联系我们</h2>
              <div className="bg-gray-50 rounded-xl p-8">
                <div className="flex items-start mb-6">
                  <Mail className="h-6 w-6 text-primary-600 mr-3 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">隐私问题联系方式</h3>
                    <p className="text-gray-600">如果您对本隐私政策有任何问题或担忧，请通过以下方式联系我们：</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">邮箱联系</h4>
                    <p className="text-gray-600">privacy@yaotools.com</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">客服电话</h4>
                    <p className="text-gray-600">400-888-0001</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">在线客服</h4>
                    <p className="text-gray-600">网站右下角聊天窗口</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">响应时间</h4>
                    <p className="text-gray-600">我们会在5个工作日内回复</p>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    本隐私政策的最终解释权归 YaoTools 所有。如有争议，以中文版本为准。
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  )
}