import { useState, useEffect } from 'react'
import { supabase, type AIModel } from '../lib/supabase'
import { AlertCircle, CheckCircle } from 'lucide-react'

export const DebugAPIKeys = () => {
  const [models, setModels] = useState<AIModel[]>([])
  const [loading, setLoading] = useState(true)
  const [rawData, setRawData] = useState<any>(null)

  useEffect(() => {
    fetchModels()
  }, [])

  const fetchModels = async () => {
    try {
      console.log('Fetching models with raw query...')
      
      const { data, error } = await supabase
        .from('ai_models')
        .select('*')
        .order('created_at', { ascending: false })

      console.log('Raw Supabase response:', { data, error })

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      setRawData(data)
      setModels(data || [])
    } catch (error) {
      console.error('Error fetching AI models:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p>加载中...</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">API Key调试检查</h1>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">原始数据 (Raw Data)</h2>
        <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto max-h-96">
          {JSON.stringify(rawData, null, 2)}
        </pre>
      </div>

      <div className="space-y-4">
        {models.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到AI模型</h3>
          </div>
        ) : (
          models.map((model) => (
            <div key={model.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>ID:</strong> {model.id}
                </div>
                <div>
                  <strong>名称:</strong> {model.name}
                </div>
                <div>
                  <strong>模型名称:</strong> {model.model_name}
                </div>
                <div>
                  <strong>API URL:</strong> {model.api_url}
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-gray-50 rounded">
                <div className="flex items-center justify-between mb-2">
                  <strong>API Key 调试信息:</strong>
                  {model.api_key ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                </div>
                
                <div className="text-sm space-y-1">
                  <div>
                    <strong>类型:</strong> {typeof model.api_key}
                  </div>
                  <div>
                    <strong>是否为空:</strong> {model.api_key ? 'false' : 'true'}
                  </div>
                  <div>
                    <strong>长度:</strong> {model.api_key?.length || 0}
                  </div>
                  {model.api_key && (
                    <>
                      <div>
                        <strong>前20个字符:</strong> {model.api_key.substring(0, 20)}
                      </div>
                      <div>
                        <strong>完整值 (谨慎显示):</strong> 
                        <details className="mt-1">
                          <summary className="cursor-pointer text-blue-600">点击显示完整API Key</summary>
                          <code className="bg-white p-2 rounded border mt-1 block break-all text-xs">
                            {model.api_key}
                          </code>
                        </details>
                      </div>
                    </>
                  )}
                  {!model.api_key && (
                    <div className="text-red-600">
                      <strong>问题:</strong> API Key 为 null、undefined 或空字符串
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-sm font-medium text-blue-900 mb-2">调试提示:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• 检查 Supabase 数据库表 ai_models 中是否真的有 API Key 数据</li>
          <li>• 检查列名是否正确（api_key）</li>
          <li>• 检查 RLS (Row Level Security) 策略是否阻止了数据读取</li>
          <li>• 查看浏览器控制台的完整原始数据</li>
        </ul>
      </div>
    </div>
  )
}