import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AdminLayout } from '../../components/AdminLayout'
import { supabase } from '../../lib/supabase'
import { Save, Eye, Code, Settings } from 'lucide-react'

export const AdminToolForm = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEditing = !!id
  
  const [loading, setLoading] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html')
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    required_role: 'user' as const,
    html_code: '',
    css_code: '',
    js_code: '',
    is_active: true
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isEditing && id) {
      fetchTool(id)
    }
  }, [isEditing, id])

  const fetchTool = async (toolId: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .eq('id', toolId)
        .single()

      if (error) throw error

      setFormData({
        name: data.name,
        description: data.description,
        category: data.category,
        required_role: data.required_role,
        html_code: data.html_code || '',
        css_code: data.css_code || '',
        js_code: data.js_code || '',
        is_active: data.is_active
      })
    } catch (error) {
      console.error('Error fetching tool:', error)
      alert('获取工具信息失败')
      navigate('/admin/tools')
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = '工具名称不能为空'
    }

    if (!formData.description.trim()) {
      newErrors.description = '工具描述不能为空'
    }

    if (!formData.category.trim()) {
      newErrors.category = '工具分类不能为空'
    }

    if (!formData.html_code.trim()) {
      newErrors.html_code = 'HTML代码不能为空'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)

      const toolData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category.trim(),
        required_role: formData.required_role,
        code_url: '', // 为内联代码工具提供空的code_url
        tool_type: 'code', // 设置为代码类型工具
        html_code: formData.html_code,
        css_code: formData.css_code,
        js_code: formData.js_code,
        is_sandbox: true, // 内联代码工具默认启用沙盒模式
        is_active: formData.is_active
      }

      if (isEditing && id) {
        const { error } = await supabase
          .from('tools')
          .update(toolData)
          .eq('id', id)

        if (error) throw error
        alert('工具更新成功！')
      } else {
        const { error } = await supabase
          .from('tools')
          .insert([toolData])

        if (error) throw error
        alert('工具创建成功！')
      }

      navigate('/admin/tools')
    } catch (error) {
      console.error('Error saving tool:', error)
      alert(`${isEditing ? '更新' : '创建'}工具失败`)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // 清除对应字段的错误信息
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const generatePreviewDoc = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${formData.name} - 预览</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
          ${formData.css_code}
        </style>
      </head>
      <body>
        ${formData.html_code}
        <script>
          ${formData.js_code}
        </script>
      </body>
      </html>
    `
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-48 mb-6"></div>
            <div className="space-y-4">
              <div className="h-10 bg-gray-300 rounded"></div>
              <div className="h-32 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? '编辑工具' : '创建新工具'}
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              {isEditing ? '修改工具信息和代码' : '创建一个新的工具'}
            </p>
          </div>
          
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Eye className="h-4 w-4 mr-2" />
              {previewMode ? '编辑模式' : '预览模式'}
            </button>
          </div>
        </div>

        {previewMode ? (
          // 预览模式
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">工具预览</h3>
              <p className="text-sm text-gray-500">{formData.name}</p>
            </div>
            <div className="p-6">
              <div className="border rounded-lg overflow-hidden">
                <iframe
                  srcDoc={generatePreviewDoc()}
                  className="w-full h-96 border-0"
                  title="工具预览"
                />
              </div>
            </div>
          </div>
        ) : (
          // 编辑模式
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 基本信息 */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <Settings className="h-5 w-5 text-gray-400 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">基本信息</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    工具名称 *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="输入工具名称"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    分类 *
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.category ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="如：文本处理、图片工具等"
                  />
                  {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    权限要求
                  </label>
                  <select
                    value={formData.required_role}
                    onChange={(e) => handleInputChange('required_role', e.target.value as any)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="user">普通用户</option>
                    <option value="premium">高级用户</option>
                    <option value="admin">管理员</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => handleInputChange('is_active', e.target.checked)}
                      className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-700">启用工具</span>
                  </label>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700">
                  工具描述 *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.description ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="描述工具的功能和用途"
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
              </div>
            </div>

            {/* 代码编辑 */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Code className="h-5 w-5 text-gray-400 mr-2" />
                    <h3 className="text-lg font-medium text-gray-900">代码编辑</h3>
                  </div>
                  
                  <div className="flex space-x-1">
                    <button
                      type="button"
                      onClick={() => setActiveTab('html')}
                      className={`px-3 py-1 text-sm font-medium rounded ${
                        activeTab === 'html'
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      HTML
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('css')}
                      className={`px-3 py-1 text-sm font-medium rounded ${
                        activeTab === 'css'
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      CSS
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('js')}
                      className={`px-3 py-1 text-sm font-medium rounded ${
                        activeTab === 'js'
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      JavaScript
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {activeTab === 'html' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      HTML 代码 *
                    </label>
                    <textarea
                      value={formData.html_code}
                      onChange={(e) => handleInputChange('html_code', e.target.value)}
                      rows={15}
                      className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm ${
                        errors.html_code ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="在这里输入HTML代码..."
                    />
                    {errors.html_code && <p className="mt-1 text-sm text-red-600">{errors.html_code}</p>}
                  </div>
                )}

                {activeTab === 'css' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CSS 代码
                    </label>
                    <textarea
                      value={formData.css_code}
                      onChange={(e) => handleInputChange('css_code', e.target.value)}
                      rows={15}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
                      placeholder="在这里输入CSS代码..."
                    />
                  </div>
                )}

                {activeTab === 'js' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      JavaScript 代码
                    </label>
                    <textarea
                      value={formData.js_code}
                      onChange={(e) => handleInputChange('js_code', e.target.value)}
                      rows={15}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
                      placeholder="在这里输入JavaScript代码..."
                    />
                  </div>
                )}
              </div>
            </div>

            {/* 提交按钮 */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/admin/tools')}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? '保存中...' : (isEditing ? '更新工具' : '创建工具')}
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  )
}