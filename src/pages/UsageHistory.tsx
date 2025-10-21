import { useState, useEffect } from 'react'
import { Layout } from '../components/Layout'
import { PrivateRoute } from '../components/PrivateRoute'
import { useAuthStore } from '../lib/store'
import { supabase, type UsageLog } from '../lib/supabase'
import { Clock, Zap, Calendar, Filter, Search } from 'lucide-react'

export const UsageHistory = () => {
  const { user } = useAuthStore()
  const [logs, setLogs] = useState<UsageLog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const [dateFilter, setDateFilter] = useState('全部')
  const [categories, setCategories] = useState<string[]>(['全部'])

  useEffect(() => {
    if (user) {
      fetchUsageLogs()
    }
  }, [user])

  const fetchUsageLogs = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('usage_logs')
        .select(`
          *,
          tools (
            name,
            category
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      const logsData = data as UsageLog[]
      setLogs(logsData)
      
      // Extract unique categories
      const categoryList = logsData
        .map(log => log.tools?.category)
        .filter((c): c is string => Boolean(c))
      const uniqueCategories = ['全部', ...Array.from(new Set(categoryList))]
      setCategories(uniqueCategories)
    } catch (error) {
      console.error('Error fetching usage logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const getFilteredLogs = () => {
    let filtered = logs

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.tools?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory !== '全部') {
      filtered = filtered.filter(log => log.tools?.category === selectedCategory)
    }

    // Filter by date
    if (dateFilter !== '全部') {
      const now = new Date()
      let startDate = new Date()

      switch (dateFilter) {
        case '今天':
          startDate.setHours(0, 0, 0, 0)
          break
        case '本周':
          startDate.setDate(now.getDate() - 7)
          break
        case '本月':
          startDate.setMonth(now.getMonth() - 1)
          break
        default:
          startDate = new Date(0) // All time
      }

      filtered = filtered.filter(log => new Date(log.created_at) >= startDate)
    }

    return filtered
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return '刚刚'
    if (diffInMinutes < 60) return `${diffInMinutes}分钟前`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}小时前`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}天前`
    
    return date.toLocaleDateString('zh-CN')
  }

  const filteredLogs = getFilteredLogs()

  if (loading) {
    return (
      <PrivateRoute>
        <Layout>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-300 rounded w-1/4"></div>
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-300 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </Layout>
      </PrivateRoute>
    )
  }

  return (
    <PrivateRoute>
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">使用历史</h1>
            <p className="text-gray-600">查看您的工具使用记录和统计信息</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">总使用次数</p>
                  <p className="text-2xl font-bold text-gray-900">{logs.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">本月使用</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {logs.filter(log => {
                      const logDate = new Date(log.created_at)
                      const now = new Date()
                      return logDate.getMonth() === now.getMonth() && 
                             logDate.getFullYear() === now.getFullYear()
                    }).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">使用过的工具</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(logs.map(log => log.tool_id)).size}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索工具..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-10 pr-8 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Date Filter */}
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="pl-10 pr-8 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="全部">全部时间</option>
                  <option value="今天">今天</option>
                  <option value="本周">本周</option>
                  <option value="本月">本月</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results count */}
          <div className="mb-4">
            <p className="text-gray-600">
              显示 <span className="font-medium">{filteredLogs.length}</span> 条记录
            </p>
          </div>

          {/* Usage logs */}
          {filteredLogs.length > 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="divide-y divide-gray-200">
                {filteredLogs.map((log) => (
                  <div key={log.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                          <Zap className="h-5 w-5 text-primary-600" />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">
                            {log.tools?.name || '未知工具'}
                          </h3>
                          <div className="flex items-center text-sm text-gray-500">
                            <span className="bg-primary-100 text-primary-600 px-2 py-1 rounded mr-3">
                              {log.tools?.category || '未分类'}
                            </span>
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{formatDate(log.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <Clock className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">暂无使用记录</h3>
              <p className="mt-1 text-sm text-gray-500">
                您还没有使用过任何工具，快去探索一下吧！
              </p>
            </div>
          )}
        </div>
      </Layout>
    </PrivateRoute>
  )
}