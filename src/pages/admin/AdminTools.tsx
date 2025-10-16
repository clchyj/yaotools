import { useState, useEffect } from 'react'
import { AdminLayout } from '../../components/AdminLayout'
import { supabase } from '../../lib/supabase'
import type { Tool } from '../../types'
import { Search, Plus, Edit2, Trash2, Eye, EyeOff, Code } from 'lucide-react'

interface ToolWithStats extends Tool {
  usage_count: number
}

export const AdminTools = () => {
  const [tools, setTools] = useState<ToolWithStats[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [previewingTool, setPreviewingTool] = useState<Tool | null>(null)

  useEffect(() => {
    fetchTools()
  }, [])

  const fetchTools = async () => {
    try {
      const { data, error } = await supabase
        .from('tools')
        .select(`
          *,
          usage_count:usage_logs(count)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      // 处理数据结构
      const processedTools = data?.map(tool => ({
        ...tool,
        usage_count: tool.usage_count?.[0]?.count || 0
      })) || []

      setTools(processedTools)
    } catch (error) {
      console.error('Error fetching tools:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (toolId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('tools')
        .update({ is_active: !currentStatus })
        .eq('id', toolId)

      if (error) throw error

      setTools(tools.map(tool =>
        tool.id === toolId ? { ...tool, is_active: !currentStatus } : tool
      ))
    } catch (error) {
      console.error('Error updating tool status:', error)
      alert('更新工具状态失败')
    }
  }

  const handleDeleteTool = async (toolId: string) => {
    if (!confirm('确定要删除这个工具吗？此操作不可撤销。')) {
      return
    }

    try {
      const { error } = await supabase
        .from('tools')
        .delete()
        .eq('id', toolId)

      if (error) throw error

      setTools(tools.filter(tool => tool.id !== toolId))
    } catch (error) {
      console.error('Error deleting tool:', error)
      alert('删除工具失败')
    }
  }

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = categoryFilter === 'all' || tool.category === categoryFilter
    
    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'active' && tool.is_active) ||
      (statusFilter === 'inactive' && !tool.is_active)

    return matchesSearch && matchesCategory && matchesStatus
  })

  // 获取所有分类
  const categories = [...new Set(tools.map(tool => tool.category))]

  const getStatusBadge = (isActive: boolean) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`}>
      {isActive ? '启用' : '禁用'}
    </span>
  )

  const getRoleBadge = (requiredRole: string) => {
    const roleConfig = {
      user: { text: '免费', class: 'bg-gray-100 text-gray-800' },
      premium: { text: '高级', class: 'bg-purple-100 text-purple-800' },
      admin: { text: '管理员', class: 'bg-orange-100 text-orange-800' }
    }
    const config = roleConfig[requiredRole as keyof typeof roleConfig] || roleConfig.user
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.class}`}>
        {config.text}
      </span>
    )
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-48 mb-6"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">工具管理</h1>
            <p className="mt-1 text-sm text-gray-600">
              管理系统中的所有工具
            </p>
          </div>
          <a
            href="/admin/tools/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            添加新工具
          </a>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="搜索工具..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 w-full"
              />
            </div>
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">所有分类</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">所有状态</option>
              <option value="active">启用</option>
              <option value="inactive">禁用</option>
            </select>

            <div className="flex items-center text-sm text-gray-500">
              共 {filteredTools.length} 个工具
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <div key={tool.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {tool.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                      {tool.description}
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    {getStatusBadge(tool.is_active)}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                  <span>{tool.category}</span>
                  {getRoleBadge(tool.required_role)}
                </div>

                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                  <span>使用次数: {tool.usage_count}</span>
                  <span>{new Date(tool.created_at).toLocaleDateString('zh-CN')}</span>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setPreviewingTool(tool)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title="预览"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <a
                      href={`/admin/tools/${tool.id}/edit`}
                      className="p-2 text-indigo-400 hover:text-indigo-600"
                      title="编辑"
                    >
                      <Edit2 className="h-4 w-4" />
                    </a>
                    <button
                      onClick={() => handleDeleteTool(tool.id)}
                      className="p-2 text-red-400 hover:text-red-600"
                      title="删除"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <button
                    onClick={() => handleToggleStatus(tool.id, tool.is_active)}
                    className={`p-2 ${
                      tool.is_active 
                        ? 'text-red-400 hover:text-red-600' 
                        : 'text-green-400 hover:text-green-600'
                    }`}
                    title={tool.is_active ? '禁用' : '启用'}
                  >
                    {tool.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-12">
            <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到工具</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all'
                ? '尝试调整筛选条件'
                : '开始创建第一个工具吧'
              }
            </p>
            <a
              href="/admin/tools/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              添加新工具
            </a>
          </div>
        )}

        {/* Preview Modal */}
        {previewingTool && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium">{previewingTool.name}</h3>
                    <p className="text-sm text-gray-500">{previewingTool.description}</p>
                  </div>
                  <button
                    onClick={() => setPreviewingTool(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <span className="sr-only">关闭</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="border rounded-lg overflow-hidden">
                  <iframe
                    srcDoc={`
                      <!DOCTYPE html>
                      <html>
                      <head>
                        <style>${previewingTool.css_code || ''}</style>
                      </head>
                      <body>
                        ${previewingTool.html_code || ''}
                        <script>${previewingTool.js_code || ''}</script>
                      </body>
                      </html>
                    `}
                    className="w-full h-96 border-0"
                    title="工具预览"
                  />
                </div>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <dt className="font-medium text-gray-500">分类</dt>
                    <dd className="mt-1 text-gray-900">{previewingTool.category}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-500">权限要求</dt>
                    <dd className="mt-1">{getRoleBadge(previewingTool.required_role)}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-500">创建时间</dt>
                    <dd className="mt-1 text-gray-900">
                      {new Date(previewingTool.created_at).toLocaleDateString('zh-CN')}
                    </dd>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}