import { Layout } from '../components/Layout'

export const About = () => {
  return (
    <Layout>
      <div className="bg-white">
        {/* Hero Section (simplified, no gradient) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 text-gray-900">关于 YaoTools</h1>
            <p className="text-lg sm:text-xl text-gray-700">
              追热点·探科技·AI工具·Python干货，快人一步！
            </p>
          </div>
        </div>

        {/* WeChat Promotion Section */}
        <section className="py-12 bg-yellow-50 border-y border-yellow-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
                  关注公众号：<span className="text-primary-600">小妖同学学AI</span>
                </h2>
                <p className="text-lg text-gray-700 mb-4">
                  追热点·探科技·AI工具·Python干货，快人一步！
                </p>
                <p className="text-base text-yellow-900 bg-yellow-100 inline-block px-3 py-1 rounded">
                  关注后立即获取可用次数 <span className="font-bold">99</span> 次
                </p>
              </div>
              <div className="flex md:justify-end">
                <div className="bg-white rounded-xl border-2 border-gray-200 p-4 text-center">
                  <img src="/image/gzh.jpg" alt="公众号二维码：小妖同学学AI" className="w-48 h-48 object-cover rounded-lg mx-auto" />
                  <p className="mt-2 text-sm text-gray-600">扫码关注，立即领取次数</p>
                </div>
              </div>
            </div>
          </div>
        </section>





      </div>
    </Layout>
  )
}