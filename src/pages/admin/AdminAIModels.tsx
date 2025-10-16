import { useState, useEffect } from 'react'
import { AdminLayout } from '../../components/AdminLayout'
import { supabase, type AIModel } from '../../lib/supabase'
import { 
  Plus, 
  Edit2, 
  Trash2, 
  TestTube, 
  CheckCircle, 
  XCircle,
  Loader2,
  Bot,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react'

interface AIModelForm extends Omit<AIModel, 'id' | 'created_at' | 'updated_at'> {
  id?: string
}

export const AdminAIModels = () => {
  const [models, setModels] = useState<AIModel[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingModel, setEditingModel] = useState<AIModel | null>(null)
  const [testingModel, setTestingModel] = useState<string | null>(null)
  const [showApiKey, setShowApiKey] = useState(false)
  const [formData, setFormData] = useState<AIModelForm>({
    name: '',
    model_name: '',
    api_url: 'https://openrouter.ai/api/v1/chat/completions',
    api_key: '',
    description: '',
    max_tokens: 1000,
    temperature: 0.7,
    is_active: true,
    is_default: false
  })

  useEffect(() => {
    fetchModels()
  }, [])
  
  // 监控formData变化
  useEffect(() => {
    if (isFormOpen && formData.api_key) {
      console.log('FormData API Key changed:', {
        length: formData.api_key.length,
        preview: formData.api_key.substring(0, 15) + '...',
        type: typeof formData.api_key
      })
    }
  }, [formData.api_key, isFormOpen])

  const fetchModels = async () => {
    try {
      console.log('Fetching models from database...')
      
      // 强制刷新，避免缓存
      const { data, error } = await supabase
        .from('ai_models')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }
      
      console.log('Raw database response:', data)
      console.log('Processed models info:', data?.map(m => ({
        id: m.id,
        name: m.name,
        api_key: m.api_key ? {
          type: typeof m.api_key,
          length: m.api_key.length,
          preview: m.api_key.substring(0, 15) + '...',
          full: m.api_key  // 临时显示完整值用于调试
        } : 'null/empty'
      })))
      
      setModels(data || [])
    } catch (error) {
      console.error('Error fetching AI models:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      model_name: '',
      api_url: 'https://openrouter.ai/api/v1/chat/completions',
      api_key: '',
      description: '',
      max_tokens: 1000,
      temperature: 0.7,
      is_active: true,
      is_default: false
    })
    setEditingModel(null)
    setIsFormOpen(false)
    setShowApiKey(false) // 重置显示状态
  }

  const verifyApiKeyFromDB = async (modelId: string) => {
    console.log('Verifying API Key from database for model:', modelId)
    try {
      const { data, error } = await supabase
        .from('ai_models')
        .select('id, name, api_key')
        .eq('id', modelId)
        .single()
      
      if (error) {
        console.error('Error verifying API key:', error)
        return null
      }
      
      console.log('Direct DB query result:', {
        id: data.id,
        name: data.name,
        api_key_exists: !!data.api_key,
        api_key_type: typeof data.api_key,
        api_key_length: data.api_key?.length || 0,
        api_key_preview: data.api_key ? data.api_key.substring(0, 20) + '...' : 'null',
        api_key_full: data.api_key  // 临时显示用于调试
      })
      
      return data.api_key
    } catch (error) {
      console.error('Error in API key verification:', error)
      return null
    }
  }

  const handleEdit = async (model: AIModel) => {
    console.log('=== STARTING EDIT PROCESS ===')
    console.log('Original model data from props:', {
      id: model.id,
      name: model.name,
      api_key: model.api_key ? {
        type: typeof model.api_key,
        length: model.api_key.length,
        preview: model.api_key.substring(0, 20) + '...'
      } : 'null/empty'
    })
    
    // 直接从数据库重新获取最新的API Key
    const freshApiKey = await verifyApiKeyFromDB(model.id)
    
    const newFormData = {
      id: model.id,
      name: model.name,
      model_name: model.model_name,
      api_url: model.api_url,
      api_key: freshApiKey || model.api_key || '', // 使用最新的值
      description: model.description || '',
      max_tokens: model.max_tokens || 1000,
      temperature: model.temperature || 0.7,
      is_active: model.is_active,
      is_default: model.is_default
    }
    
    console.log('Final form data to set:', {
      ...newFormData,
      api_key: newFormData.api_key ? {
        type: typeof newFormData.api_key,
        length: newFormData.api_key.length,
        preview: newFormData.api_key.substring(0, 20) + '...'
      } : 'empty'
    })
    
    setFormData(newFormData)
    setEditingModel(model)
    setShowApiKey(false) // 默认隐藏API Key
    setIsFormOpen(true)
    console.log('=== EDIT PROCESS COMPLETE ===')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingModel) {
        // Update existing model
        const { error } = await supabase
          .from('ai_models')
          .update({
            name: formData.name,
            model_name: formData.model_name,
            api_url: formData.api_url,
            api_key: formData.api_key,
            description: formData.description,
            max_tokens: formData.max_tokens,
            temperature: formData.temperature,
            is_active: formData.is_active,
            is_default: formData.is_default,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingModel.id)

        if (error) throw error
      } else {
        // Create new model
        const { error } = await supabase
          .from('ai_models')
          .insert([formData])

        if (error) throw error
      }

      // If setting as default, update other models
      if (formData.is_default) {
        await supabase
          .from('ai_models')
          .update({ is_default: false })
          .neq('id', editingModel?.id || '')
      }

      await fetchModels()
      resetForm()
    } catch (error) {
      console.error('Error saving AI model:', error)
      alert('保存失败，请重试')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个AI模型吗？')) return

    try {
      const { error } = await supabase
        .from('ai_models')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchModels()
    } catch (error) {
      console.error('Error deleting AI model:', error)
      alert('删除失败，请重试')
    }
  }

  const testConnection = async (model: AIModel) => {
    setTestingModel(model.id)
    
    try {
      // 根据API URL决定使用哪些请求头
      const isModelScope = model.api_url.includes('modelscope.cn')
      const isOpenRouter = model.api_url.includes('openrouter.ai')
      
      const headers: Record<string, string> = {
        'Authorization': `Bearer ${model.api_key}`,
        'Content-Type': 'application/json'
      }
      
      // 只为OpenRouter添加额外请求头
      if (isOpenRouter) {
        headers['HTTP-Referer'] = window.location.origin
        headers['X-Title'] = 'YaoTools Admin Test'
      }
      
      console.log(`Testing ${isModelScope ? 'ModelScope' : isOpenRouter ? 'OpenRouter' : 'Unknown'} API...`)
      console.log('Request headers:', Object.keys(headers))
      
      const response = await fetch(model.api_url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: model.model_name,
          messages: [
            {
              role: 'user',
              content: 'Hello, this is a connection test.'
            }
          ],
          max_tokens: 10
        })
      })
      
      console.log('Response status:', response.status)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))

      if (response.ok) {
        const data = await response.json()
        console.log('Response data:', data)
        alert('连接测试成功！')
      } else {
        const errorText = await response.text()
        console.error('API Error response:', errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }
    } catch (error) {
      console.error('Connection test failed:', error)
      
      let errorMessage = '未知错误'
      
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        errorMessage = '网络连接失败，可能是CORS限制或网络问题'
      } else if (error instanceof Error) {
        errorMessage = error.message
      }
      
      alert(`连接测试失败: ${errorMessage}`)
    } finally {
      setTestingModel(null)
    }
  }

  const toggleStatus = async (model: AIModel) => {
    try {
      const { error } = await supabase
        .from('ai_models')
        .update({ 
          is_active: !model.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', model.id)

      if (error) throw error
      await fetchModels()
    } catch (error) {
      console.error('Error updating model status:', error)
    }
  }

  const setAsDefault = async (model: AIModel) => {
    try {
      // First, set all models to not default
      await supabase
        .from('ai_models')
        .update({ is_default: false })

      // Then set the selected model as default
      const { error } = await supabase
        .from('ai_models')
        .update({ 
          is_default: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', model.id)

      if (error) throw error
      await fetchModels()
    } catch (error) {
      console.error('Error setting default model:', error)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-300 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI模型管理</h1>
            <p className="text-gray-600 mt-1">配置和管理系统中的AI模型</p>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            添加模型
          </button>
        </div>

        {/* Models List */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {models.length === 0 ? (
            <div className="p-8 text-center">
              <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无AI模型</h3>
              <p className="text-gray-600">点击上方按钮添加第一个AI模型</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      模型信息
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      配置
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      状态
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {models.map((model) => (
                    <tr key={model.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 flex items-center">
                            {model.name}
                            {model.is_default && (
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                默认
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">{model.model_name}</div>
                          {model.description && (
                            <div className="text-xs text-gray-400 mt-1">{model.description}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div>温度: {model.temperature}</div>
                          <div>最大Token: {model.max_tokens}</div>
                          <div className="flex items-center mt-1">
                            <span className="text-xs text-gray-500 mr-1">API Key:</span>
                            {model.api_key ? (
                              <span className="text-xs text-green-600 flex items-center">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                已配置
                              </span>
                            ) : (
                              <span className="text-xs text-red-600 flex items-center">
                                <XCircle className="h-3 w-3 mr-1" />
                                未配置
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleStatus(model)}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            model.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {model.is_active ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <XCircle className="h-3 w-3 mr-1" />
                          )}
                          {model.is_active ? '启用' : '禁用'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => testConnection(model)}
                          disabled={testingModel === model.id}
                          className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                          title="测试连接"
                        >
                          {testingModel === model.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <TestTube className="h-4 w-4" />
                          )}
                        </button>
                        {!model.is_default && (
                          <button
                            onClick={() => setAsDefault(model)}
                            className="text-green-600 hover:text-green-900"
                            title="设为默认"
                          >
                            <Settings className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(model)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="编辑"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(model.id)}
                          className="text-red-600 hover:text-red-900"
                          title="删除"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Form Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {editingModel ? '编辑AI模型' : '添加AI模型'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      模型名称
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="GPT-4, Claude等"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      API模型名称
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.model_name}
                      onChange={(e) => setFormData({ ...formData, model_name: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="deepseek/deepseek-r1-0528:free"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      API URL
                    </label>
                    <input
                      type="url"
                      required
                      value={formData.api_url}
                      onChange={(e) => setFormData({ ...formData, api_url: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      API Key
                    </label>
                    <div className="relative">
                      <input
                        type={showApiKey ? "text" : "password"}
                        required
                        value={formData.api_key}
                        onChange={(e) => setFormData({ ...formData, api_key: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder={editingModel ? "••••••••" : "sk-or-v1-..."}
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        title={showApiKey ? "隐藏API Key" : "显示API Key"}
                      >
                        {showApiKey ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {editingModel && !showApiKey && (
                      <p className="text-xs text-gray-500 mt-1">
                        点击眼睛图标查看当前API Key
                      </p>
                    )}
                    {/* 调试信息 */}
                    <div className="text-xs text-gray-400 mt-1">
                      当前值长度: {formData.api_key?.length || 0} 字符
                      {formData.api_key && (
                        <span className="ml-2">
                          前10位: {formData.api_key.substring(0, 10)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      描述（可选）
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        最大Token
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="32000"
                        value={formData.max_tokens}
                        onChange={(e) => setFormData({ ...formData, max_tokens: parseInt(e.target.value) })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        温度
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="2"
                        step="0.1"
                        value={formData.temperature}
                        onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">启用</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.is_default}
                        onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">设为默认</span>
                    </label>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700"
                    >
                      {editingModel ? '更新' : '添加'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}