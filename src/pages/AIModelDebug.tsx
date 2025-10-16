import { useState, useEffect } from 'react'
import { supabase, type AIModel } from '../lib/supabase'
import { AlertCircle, CheckCircle, XCircle, Loader2 } from 'lucide-react'

export const AIModelDebug = () => {
  const [models, setModels] = useState<AIModel[]>([])
  const [loading, setLoading] = useState(true)
  const [testingModel, setTestingModel] = useState<string | null>(null)
  const [testResults, setTestResults] = useState<{ [key: string]: any }>({})

  useEffect(() => {
    fetchModels()
  }, [])

  const fetchModels = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_models')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setModels(data || [])
    } catch (error) {
      console.error('Error fetching models:', error)
    } finally {
      setLoading(false)
    }
  }

  const testModel = async (model: AIModel) => {
    setTestingModel(model.id)
    setTestResults(prev => ({ ...prev, [model.id]: null }))

    try {
      console.log('Testing model:', {
        name: model.name,
        api_url: model.api_url,
        api_key: model.api_key?.substring(0, 10) + '...',
        model_name: model.model_name
      })

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
        headers['X-Title'] = 'YaoTools Debug Test'
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
              content: 'Hello, this is a test message. Please respond with "Test successful".'
            }
          ],
          max_tokens: model.max_tokens || 100,
          temperature: model.temperature || 0.7
        })
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))

      const responseText = await response.text()
      console.log('Raw response:', responseText.substring(0, 1000))

      if (!response.ok) {
        setTestResults(prev => ({
          ...prev,
          [model.id]: {
            success: false,
            error: `HTTP ${response.status}: ${responseText}`,
            isHtml: responseText.startsWith('<!DOCTYPE') || responseText.includes('<html>')
          }
        }))
        return
      }

      let data
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        setTestResults(prev => ({
          ...prev,
          [model.id]: {
            success: false,
            error: 'Invalid JSON response',
            responseText: responseText.substring(0, 500),
            isHtml: responseText.startsWith('<!DOCTYPE') || responseText.includes('<html>')
          }
        }))
        return
      }

      const content = data.choices?.[0]?.message?.content
      if (content) {
        setTestResults(prev => ({
          ...prev,
          [model.id]: {
            success: true,
            response: content,
            fullData: data
          }
        }))
      } else {
        setTestResults(prev => ({
          ...prev,
          [model.id]: {
            success: false,
            error: 'No content in response',
            fullData: data
          }
        }))
      }
    } catch (error) {
      console.error('Test error:', error)
      setTestResults(prev => ({
        ...prev,
        [model.id]: {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          networkError: error instanceof TypeError && error.message.includes('Failed to fetch')
        }
      }))
    } finally {
      setTestingModel(null)
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p>加载AI模型配置中...</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">AI模型调试工具</h1>
      
      {models.length === 0 ? (
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到AI模型配置</h3>
          <p className="text-gray-600">请先在管理后台添加AI模型配置</p>
        </div>
      ) : (
        <div className="space-y-6">
          {models.map(model => (
            <div key={model.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    {model.name}
                    {model.is_default && (
                      <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded">默认</span>
                    )}
                    {!model.is_active && (
                      <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded">禁用</span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-500">{model.model_name}</p>
                </div>
                <button
                  onClick={() => testModel(model)}
                  disabled={testingModel === model.id}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
                >
                  {testingModel === model.id ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      测试中...
                    </>
                  ) : (
                    '测试连接'
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>API URL:</strong> {model.api_url}
                </div>
                <div>
                  <strong>API Key:</strong> {model.api_key?.substring(0, 20)}...
                </div>
                <div>
                  <strong>Max Tokens:</strong> {model.max_tokens}
                </div>
                <div>
                  <strong>Temperature:</strong> {model.temperature}
                </div>
              </div>

              {model.description && (
                <div className="mt-4 text-sm text-gray-600">
                  <strong>描述:</strong> {model.description}
                </div>
              )}

              {testResults[model.id] && (
                <div className="mt-4 p-4 rounded-md border">
                  {testResults[model.id].success ? (
                    <div className="text-green-800 bg-green-50 border-green-200">
                      <div className="flex items-center mb-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                        <strong>测试成功</strong>
                      </div>
                      <div className="text-sm">
                        <strong>AI回复:</strong> {testResults[model.id].response}
                      </div>
                    </div>
                  ) : (
                    <div className="text-red-800 bg-red-50 border-red-200">
                      <div className="flex items-center mb-2">
                        <XCircle className="h-5 w-5 text-red-600 mr-2" />
                        <strong>测试失败</strong>
                      </div>
                      <div className="text-sm space-y-2">
                        <div>
                          <strong>错误:</strong> {testResults[model.id].error}
                        </div>
                        {testResults[model.id].isHtml && (
                          <div className="text-yellow-700 bg-yellow-50 p-2 rounded">
                            ⚠️ 返回的是HTML页面，可能是API URL错误或API Key无效
                          </div>
                        )}
                        {testResults[model.id].networkError && (
                          <div className="text-yellow-700 bg-yellow-50 p-2 rounded">
                            ⚠️ 网络连接失败，可能是CORS问题或API服务不可用
                          </div>
                        )}
                        {testResults[model.id].responseText && (
                          <details className="mt-2">
                            <summary className="cursor-pointer text-gray-600">查看原始响应</summary>
                            <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                              {testResults[model.id].responseText}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}