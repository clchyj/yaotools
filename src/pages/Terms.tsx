import { Layout } from '../components/Layout'
import { FileText, Scale, Shield, AlertTriangle, CheckCircle, XCircle, Clock, Mail } from 'lucide-react'

export const Terms = () => {
  return (
    <Layout>
      <div className="bg-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <Scale className="h-16 w-16 mx-auto mb-6 opacity-90" />
              <h1 className="text-5xl font-bold mb-6">服务条款</h1>
              <p className="text-xl opacity-90 max-w-3xl mx-auto">
                使用 YaoTools 前，请仔细阅读并理解本服务条款。您的使用即表示同意遵守这些条款
              </p>
              <p className="text-sm opacity-75 mt-4">最后更新：2024年10月15日</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Quick Summary */}
          <section className="mb-16">
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8">
              <div className="flex items-center mb-6">
                <FileText className="h-8 w-8 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">服务条款概览</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">您可以</h3>
                    <p className="text-gray-600 text-sm mt-1">使用所有工具、保存结果、分享链接</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <XCircle className="h-6 w-6 text-red-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">您不可以</h3>
                    <p className="text-gray-600 text-sm mt-1">滥用服务、侵犯他人权利、违法使用</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Shield className="h-6 w-6 text-blue-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">我们提供</h3>
                    <p className="text-gray-600 text-sm mt-1">稳定服务、数据保护、技术支持</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="h-6 w-6 text-orange-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">服务变更</h3>
                    <p className="text-gray-600 text-sm mt-1">我们保留更新服务和条款的权利</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Table of Contents */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">目录</h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <ul className="grid md:grid-cols-2 gap-2">
                <li><a href="#acceptance" className="text-primary-600 hover:text-primary-800">1. 条款接受</a></li>
                <li><a href="#service-description" className="text-primary-600 hover:text-primary-800">2. 服务描述</a></li>
                <li><a href="#account" className="text-primary-600 hover:text-primary-800">3. 账户注册</a></li>
                <li><a href="#usage-rules" className="text-primary-600 hover:text-primary-800">4. 使用规则</a></li>
                <li><a href="#prohibited" className="text-primary-600 hover:text-primary-800">5. 禁止行为</a></li>
                <li><a href="#intellectual-property" className="text-primary-600 hover:text-primary-800">6. 知识产权</a></li>
                <li><a href="#payment" className="text-primary-600 hover:text-primary-800">7. 付费与订阅</a></li>
                <li><a href="#service-availability" className="text-primary-600 hover:text-primary-800">8. 服务可用性</a></li>
                <li><a href="#limitation" className="text-primary-600 hover:text-primary-800">9. 责任限制</a></li>
                <li><a href="#termination" className="text-primary-600 hover:text-primary-800">10. 服务终止</a></li>
                <li><a href="#changes" className="text-primary-600 hover:text-primary-800">11. 条款变更</a></li>
                <li><a href="#contact-terms" className="text-primary-600 hover:text-primary-800">12. 联系方式</a></li>
              </ul>
            </div>
          </section>

          {/* Content Sections */}
          <div className="space-y-12">
            <section id="acceptance">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">1. 条款接受</h2>
              <div className="prose prose-lg text-gray-600">
                <p className="mb-4">
                  欢迎使用 YaoTools 在线工具平台。通过访问或使用我们的服务，您同意受本服务条款约束。
                </p>
                <p className="mb-4">
                  如果您不同意这些条款的任何部分，请不要使用我们的服务。如果您代表组织使用我们的服务，您声明您有权代表该组织接受这些条款。
                </p>
                <p>
                  这些条款适用于所有访问或使用服务的用户，包括但不限于浏览、注册用户和付费用户。
                </p>
              </div>
            </section>

            <section id="service-description">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">2. 服务描述</h2>
              <div className="prose prose-lg text-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">2.1 服务内容</h3>
                <p className="mb-4">YaoTools 提供各种在线工具，包括但不限于：</p>
                <ul className="list-disc list-inside space-y-2 mb-6">
                  <li>文本处理工具（JSON格式化、编码转换等）</li>
                  <li>图片处理工具（压缩、转换、编辑等）</li>
                  <li>开发者工具（代码格式化、API测试等）</li>
                  <li>实用工具（二维码生成、计算器等）</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">2.2 服务特点</h3>
                <ul className="list-disc list-inside space-y-2 mb-6">
                  <li>基于Web的在线处理，无需下载软件</li>
                  <li>支持多种文件格式和处理选项</li>
                  <li>免费用户享有基础功能和有限使用次数</li>
                  <li>付费用户享有高级功能和更多使用次数</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">2.3 服务限制</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>文件大小和处理时间限制</li>
                  <li>每日使用次数限制（因用户等级而异）</li>
                  <li>某些高级功能需要订阅或付费</li>
                  <li>服务可用性取决于网络和服务器状态</li>
                </ul>
              </div>
            </section>

            <section id="account">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">3. 账户注册</h2>
              <div className="prose prose-lg text-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">3.1 注册要求</h3>
                <ul className="list-disc list-inside space-y-2 mb-6">
                  <li>您必须年满13岁才能注册账户</li>
                  <li>提供真实、准确和完整的注册信息</li>
                  <li>及时更新个人信息以保持准确性</li>
                  <li>每人只能注册一个账户</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">3.2 账户安全</h3>
                <ul className="list-disc list-inside space-y-2 mb-6">
                  <li>您有责任维护账户密码的保密性</li>
                  <li>您对账户下发生的所有活动负责</li>
                  <li>如发现未经授权的使用，应立即通知我们</li>
                  <li>我们有权暂停可疑账户以保护安全</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">3.3 账户使用</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>不得将账户转让给他人</li>
                  <li>不得共享账户凭据</li>
                  <li>不得创建虚假身份或冒充他人</li>
                  <li>不得使用自动化程序创建账户</li>
                </ul>
              </div>
            </section>

            <section id="usage-rules">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">4. 使用规则</h2>
              <div className="prose prose-lg text-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">4.1 合法使用</h3>
                <ul className="list-disc list-inside space-y-2 mb-6">
                  <li>仅将服务用于合法目的</li>
                  <li>遵守所有适用的法律法规</li>
                  <li>尊重他人的权利和隐私</li>
                  <li>不上传包含恶意代码的文件</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">4.2 文件处理</h3>
                <ul className="list-disc list-inside space-y-2 mb-6">
                  <li>确保您有权处理上传的文件</li>
                  <li>不上传包含病毒或恶意软件的文件</li>
                  <li>不上传侵犯他人知识产权的内容</li>
                  <li>处理后及时下载结果，我们不长期保存</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">4.3 公平使用</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>不滥用服务资源</li>
                  <li>不使用自动化工具大量请求</li>
                  <li>遵守使用次数和频率限制</li>
                  <li>不干扰其他用户的正常使用</li>
                </ul>
              </div>
            </section>

            <section id="prohibited">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">5. 禁止行为</h2>
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
                <div className="flex items-start">
                  <AlertTriangle className="h-6 w-6 text-red-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-red-800 mb-2">严重违规将导致账户永久封禁</h3>
                    <p className="text-red-700">请务必遵守以下禁止行为规定，违反者将承担法律责任。</p>
                  </div>
                </div>
              </div>

              <div className="prose prose-lg text-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">5.1 法律违法行为</h3>
                <ul className="list-disc list-inside space-y-2 mb-6">
                  <li>上传、处理或分享非法内容</li>
                  <li>侵犯他人知识产权</li>
                  <li>传播恶意软件或病毒</li>
                  <li>进行任何形式的网络攻击</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">5.2 滥用行为</h3>
                <ul className="list-disc list-inside space-y-2 mb-6">
                  <li>使用机器人或自动化工具</li>
                  <li>绕过使用限制或安全措施</li>
                  <li>逆向工程或反编译服务</li>
                  <li>干扰服务的正常运行</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">5.3 商业滥用</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>未经授权的商业使用</li>
                  <li>转售或再分发服务</li>
                  <li>创建竞争性服务</li>
                  <li>大规模自动化使用</li>
                </ul>
              </div>
            </section>

            <section id="intellectual-property">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">6. 知识产权</h2>
              <div className="prose prose-lg text-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">6.1 我们的权利</h3>
                <p className="mb-4">
                  YaoTools 平台、软件、技术、商标、版权和其他知识产权均归我们所有。未经明确授权，您不得：
                </p>
                <ul className="list-disc list-inside space-y-2 mb-6">
                  <li>复制、修改或分发我们的软件或内容</li>
                  <li>使用我们的商标或品牌元素</li>
                  <li>反向工程或试图获取源代码</li>
                  <li>创建衍生作品或竞争产品</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">6.2 您的权利</h3>
                <p className="mb-4">您对上传和处理的内容保留所有权利。我们不会：</p>
                <ul className="list-disc list-inside space-y-2 mb-6">
                  <li>声称对您的内容拥有所有权</li>
                  <li>将您的内容用于服务提供以外的目的</li>
                  <li>在处理完成后保留您的文件</li>
                  <li>与第三方分享您的内容（法律要求除外）</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">6.3 侵权投诉</h3>
                <p>如果您认为有内容侵犯了您的知识产权，请联系我们的法务部门：legal@yaotools.com</p>
              </div>
            </section>

            <section id="payment">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">7. 付费与订阅</h2>
              <div className="prose prose-lg text-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">7.1 付费服务</h3>
                <ul className="list-disc list-inside space-y-2 mb-6">
                  <li>部分高级功能需要付费或订阅</li>
                  <li>价格可能因地区和促销活动而异</li>
                  <li>付费前您将看到明确的价格信息</li>
                  <li>付费即表示您接受相关条款</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">7.2 订阅管理</h3>
                <ul className="list-disc list-inside space-y-2 mb-6">
                  <li>订阅将自动续费，除非您取消</li>
                  <li>您可以随时在账户设置中取消订阅</li>
                  <li>取消后服务将在当前周期结束时终止</li>
                  <li>我们可能调整订阅价格（需提前通知）</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">7.3 退款政策</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>新订阅用户享有7天无理由退款</li>
                  <li>如果服务严重故障，可申请按比例退款</li>
                  <li>退款将原路返回到原支付方式</li>
                  <li>滥用退款政策的用户可能被限制服务</li>
                </ul>
              </div>
            </section>

            <section id="service-availability">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">8. 服务可用性</h2>
              <div className="prose prose-lg text-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">8.1 服务承诺</h3>
                <ul className="list-disc list-inside space-y-2 mb-6">
                  <li>我们努力提供99.9%的服务可用性</li>
                  <li>提供24/7的技术监控</li>
                  <li>维护期间将提前通知</li>
                  <li>紧急修复可能无法提前通知</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">8.2 服务中断</h3>
                <p className="mb-4">服务可能因以下原因中断，我们不承担责任：</p>
                <ul className="list-disc list-inside space-y-2 mb-6">
                  <li>网络故障或互联网服务中断</li>
                  <li>第三方服务提供商的问题</li>
                  <li>自然灾害或不可抗力事件</li>
                  <li>政府政策或法规变化</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">8.3 服务变更</h3>
                <p>我们保留随时修改、暂停或终止服务的权利，包括但不限于功能调整、界面改版或技术升级。</p>
              </div>
            </section>

            <section id="limitation">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">9. 责任限制</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
                <div className="flex items-start">
                  <AlertTriangle className="h-6 w-6 text-yellow-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-yellow-800 mb-2">重要免责声明</h3>
                    <p className="text-yellow-700">请仔细阅读以下责任限制条款，这些条款可能影响您的法律权利。</p>
                  </div>
                </div>
              </div>

              <div className="prose prose-lg text-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">9.1 服务提供方式</h3>
                <p className="mb-4">
                  我们的服务按"现状"和"可用"基础提供，不提供任何明示或暗示的保证，包括但不限于：
                </p>
                <ul className="list-disc list-inside space-y-2 mb-6">
                  <li>服务的可靠性、准确性或完整性</li>
                  <li>服务满足您的特定需求</li>
                  <li>服务不会中断或无错误</li>
                  <li>通过服务获得的结果的准确性</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">9.2 责任限制</h3>
                <p className="mb-4">
                  在法律允许的最大范围内，我们不对以下损失承担责任：
                </p>
                <ul className="list-disc list-inside space-y-2 mb-6">
                  <li>直接、间接、偶然或后果性损害</li>
                  <li>利润损失、数据丢失或业务中断</li>
                  <li>第三方服务或内容的损害</li>
                  <li>您的疏忽或误用导致的损失</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">9.3 赔偿限额</h3>
                <p>
                  我们的总赔偿责任不超过您在过去12个月内向我们支付的费用，免费用户的赔偿限额为100元人民币。
                </p>
              </div>
            </section>

            <section id="termination">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">10. 服务终止</h2>
              <div className="prose prose-lg text-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">10.1 您的终止权利</h3>
                <ul className="list-disc list-inside space-y-2 mb-6">
                  <li>您可以随时停止使用服务</li>
                  <li>您可以随时关闭账户</li>
                  <li>取消订阅不会立即删除账户</li>
                  <li>账户删除后数据将被永久清除</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">10.2 我们的终止权利</h3>
                <p className="mb-4">在以下情况下，我们可以暂停或终止您的账户：</p>
                <ul className="list-disc list-inside space-y-2 mb-6">
                  <li>违反本服务条款</li>
                  <li>从事违法或不当行为</li>
                  <li>滥用服务或系统资源</li>
                  <li>长期不活跃（超过2年）</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">10.3 终止后果</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>您将无法访问账户和数据</li>
                  <li>未使用的付费服务按比例退款</li>
                  <li>相关法律义务继续有效</li>
                  <li>知识产权条款继续适用</li>
                </ul>
              </div>
            </section>

            <section id="changes">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">11. 条款变更</h2>
              <div className="prose prose-lg text-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">11.1 变更通知</h3>
                <p className="mb-4">我们可能会不时修改本服务条款。重大变更时，我们会：</p>
                <ul className="list-disc list-inside space-y-2 mb-6">
                  <li>在网站显著位置发布通知</li>
                  <li>通过邮件通知注册用户</li>
                  <li>提供至少30天的过渡期</li>
                  <li>在合理情况下提供旧条款和新条款的对比</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">11.2 变更生效</h3>
                <ul className="list-disc list-inside space-y-2 mb-6">
                  <li>新条款自发布之日起生效</li>
                  <li>继续使用服务表示接受新条款</li>
                  <li>如不接受可以停止使用服务</li>
                  <li>部分变更可能需要您明确同意</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">11.3 版本管理</h3>
                <p>我们会在页面底部显示当前条款的生效日期，您可以通过联系我们获取历史版本。</p>
              </div>
            </section>

            <section id="contact-terms">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">12. 联系方式</h2>
              <div className="bg-gray-50 rounded-xl p-8">
                <div className="flex items-start mb-6">
                  <Mail className="h-6 w-6 text-primary-600 mr-3 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">法务与合规联系方式</h3>
                    <p className="text-gray-600">
                      如果您对本服务条款有任何问题、需要法律咨询或投诉，请通过以下方式联系我们：
                    </p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">法务邮箱</h4>
                    <p className="text-gray-600">legal@yaotools.com</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">客服电话</h4>
                    <p className="text-gray-600">400-888-0001</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">通信地址</h4>
                    <p className="text-gray-600">北京市朝阳区科技园区创新大厦</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">响应时间</h4>
                    <p className="text-gray-600">法务问题7个工作日内回复</p>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">管辖权和适用法律</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    本服务条款受中华人民共和国法律管辖。因本条款引起的任何争议，应通过友好协商解决；
                    协商不成的，任何一方均可向北京市朝阳区人民法院提起诉讼。
                  </p>
                  <p className="text-sm text-gray-500">
                    本服务条款的最终解释权归 YaoTools 所有。如有争议，以中文版本为准。
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