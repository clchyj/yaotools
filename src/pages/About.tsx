import { Layout } from '../components/Layout'
import { Heart, Users, Target, Star, Code, Zap, Shield, Globe } from 'lucide-react'

export const About = () => {
  return (
    <Layout>
      <div className="bg-white">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-primary-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-6">关于 YaoTools</h1>
              <p className="text-xl opacity-90 max-w-3xl mx-auto">
                我们致力于为用户提供最优质、最实用的在线工具，让复杂的任务变得简单高效
              </p>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 0v46.29c47.79 22.2 103.59 32.17 158 28 70.36-5.37 136.33-33.31 206.8-37.5 73.84-4.36 147.54 16.88 218.2 35.26 69.27 18 138.3 24.88 209.4 13.08 36.15-6 69.85-17.84 104.45-29.34C989.49 25 1113-14.29 1200 52.47V0z" fill="#ffffff"/>
            </svg>
          </div>
        </div>

        {/* Mission Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">我们的使命</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                通过创新的技术解决方案，简化用户的工作流程，提升生产力，让每个人都能轻松完成专业任务
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-8 bg-white rounded-xl shadow-sm">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">专注用户需求</h3>
                <p className="text-gray-600">
                  深入了解用户的真实需求，开发最贴合实际应用场景的工具
                </p>
              </div>

              <div className="text-center p-8 bg-white rounded-xl shadow-sm">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">高效便捷</h3>
                <p className="text-gray-600">
                  简化复杂操作，提供直观易用的界面，让工具使用变得轻而易举
                </p>
              </div>

              <div className="text-center p-8 bg-white rounded-xl shadow-sm">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">安全可靠</h3>
                <p className="text-gray-600">
                  采用业界领先的安全标准，保护用户数据隐私和信息安全
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">我们的故事</h2>
                <div className="prose prose-lg text-gray-600">
                  <p className="mb-6">
                    YaoTools 诞生于一个简单的想法：让复杂的数字任务变得简单。我们的团队在日常工作中经常遇到各种需要使用在线工具的情况，但发现市面上的工具要么功能单一，要么操作复杂，要么安全性不够。
                  </p>
                  <p className="mb-6">
                    于是在 2024 年，我们决定创建一个综合性的在线工具平台，集成最常用、最实用的功能，并以用户体验为核心，打造真正好用的工具集合。
                  </p>
                  <p>
                    从最初的几个基础工具开始，YaoTools 已经发展成为一个拥有数十种专业工具的综合平台，服务着全球数万用户，帮助他们提升工作效率，简化复杂任务。
                  </p>
                </div>
              </div>
              <div className="lg:pl-8">
                <div className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-2xl p-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary-600 mb-2">50+</div>
                      <div className="text-sm text-gray-600">专业工具</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary-600 mb-2">10K+</div>
                      <div className="text-sm text-gray-600">活跃用户</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary-600 mb-2">99.9%</div>
                      <div className="text-sm text-gray-600">服务可用性</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary-600 mb-2">24/7</div>
                      <div className="text-sm text-gray-600">在线支持</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">核心价值观</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                这些价值观指导着我们的每一个决策，塑造着我们的产品和文化
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">用户至上</h3>
                <p className="text-gray-600 text-sm">
                  始终将用户需求放在首位，持续改进产品体验
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Code className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">技术创新</h3>
                <p className="text-gray-600 text-sm">
                  拥抱新技术，持续创新，提供最先进的解决方案
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">用心服务</h3>
                <p className="text-gray-600 text-sm">
                  用心对待每一位用户，提供贴心周到的服务
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Globe className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">开放包容</h3>
                <p className="text-gray-600 text-sm">
                  欢迎来自世界各地的用户，打造多元化的工具生态
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">我们的团队</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                来自不同背景的专业人士，共同致力于创造最好的用户体验
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="w-32 h-32 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-shadow">
                  <span className="text-white text-3xl font-bold">Y</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">产品团队</h3>
                <p className="text-primary-600 mb-3">Product Team</p>
                <p className="text-gray-600 text-sm">
                  负责产品设计和用户体验，确保每个工具都符合用户需求
                </p>
              </div>

              <div className="text-center group">
                <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-shadow">
                  <span className="text-white text-3xl font-bold">A</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">技术团队</h3>
                <p className="text-green-600 mb-3">Tech Team</p>
                <p className="text-gray-600 text-sm">
                  由经验丰富的工程师组成，负责平台架构和功能开发
                </p>
              </div>

              <div className="text-center group">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-shadow">
                  <span className="text-white text-3xl font-bold">O</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">运营团队</h3>
                <p className="text-blue-600 mb-3">Operations Team</p>
                <p className="text-gray-600 text-sm">
                  专注于用户支持和社区建设，确保优质的服务体验
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-6">加入我们的旅程</h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              成为 YaoTools 社区的一员，与我们一起创造更好的数字工作体验
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/register"
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                立即注册
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
              >
                联系我们
              </a>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
}