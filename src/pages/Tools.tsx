import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { supabase, type Tool } from '../lib/supabase'
import { eventBus, EVENTS } from '../lib/events'
import { Search, Filter, Zap, Clock, Users, RefreshCw } from 'lucide-react'

export const Tools = () => {
  const [tools, setTools] = useState<Tool[]>([])
  const [filteredTools, setFilteredTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    fetchTools()
    
    // 设置定期刷新（每30秒）
    const interval = setInterval(() => {
      fetchTools(true)
    }, 30000)
    
    // 监听工具使用计数更新事件
    const handleToolUsageUpdate = (data: { toolId: string; newCount: number }) => {
      setTools(prevTools => 
        prevTools.map(tool => 
          tool.id === data.toolId 
            ? { ...tool, usage_count: data.newCount }
            : tool
        )
      )
    }
    
    eventBus.on(EVENTS.TOOL_USAGE_UPDATED, handleToolUsageUpdate)
    
    return () => {
      clearInterval(interval)
      eventBus.off(EVENTS.TOOL_USAGE_UPDATED, handleToolUsageUpdate)
    }
  }, [])

  useEffect(() => {
    filterTools()
  }, [tools, searchTerm, selectedCategory])

  const fetchTools = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }
    
    try {
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .eq('is_active', true)
        .order('usage_count', { ascending: false })

      if (error) throw error

      setTools(data || [])
      
      // Extract unique categories
      const uniqueCategories = ['全部', ...Array.from(new Set(data?.map(tool => tool.category) || []))]
      setCategories(uniqueCategories)
    } catch (error) {
      console.error('Error fetching tools:', error)
    } finally {
      if (isRefresh) {
        setRefreshing(false)
      } else {
        setLoading(false)
      }
    }
  }
  
  const handleRefresh = () => {
    fetchTools(true)
  }

  const filterTools = () => {
    let filtered = tools

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(tool =>
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory !== '全部') {
      filtered = filtered.filter(tool => tool.category === selectedCategory)
    }

    setFilteredTools(filtered)
  }

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-300 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-300 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">工具中心</h1>
              <p className="text-gray-600">发现和使用各种实用的在线工具，提升您的工作效率</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                refreshing
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-primary-100 text-primary-600 hover:bg-primary-200'
              }`}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? '刷新中...' : '刷新'}
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
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
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-gray-600">
            找到 <span className="font-medium">{filteredTools.length}</span> 个工具
          </p>
        </div>

        {/* Tools Grid */}
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => (
              <div
                key={tool.id}
                className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Zap className="h-5 w-5 text-primary-600" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-semibold text-gray-900">{tool.name}</h3>
                        <span className="text-sm text-primary-600">{tool.category}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {tool.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{tool.usage_count} 次使用</span>
                    </div>
                    
                    <Link
                      to={`/tools/${tool.id}`}
                      className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500"
                    >
                      使用工具
                      <Clock className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Zap className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">没有找到工具</h3>
            <p className="mt-1 text-sm text-gray-500">
              尝试调整搜索条件或选择其他分类
            </p>
          </div>
        )}
      </div>
    </Layout>
  )
}