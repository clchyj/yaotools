import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { PrivateRoute } from '../components/PrivateRoute'
import { useAuthStore } from '../lib/store'
import { supabase, type Tool } from '../lib/supabase'
import { useToolControl } from '../hooks/useToolControl'
import { QRModal } from '../components/QRModal'
import { ArrowLeft, AlertCircle, Play, Lock } from 'lucide-react'

export const ToolDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { userProfile } = useAuthStore()
  
  const [tool, setTool] = useState<Tool | null>(null)
  const [loading, setLoading] = useState(true)
  
  // 使用工具控制Hook
  const {
    isToolEnabled,
    canUseTool,
    remainingUses,
    startUsingTool,
    showQRModal,
    setShowQRModal
  } = useToolControl(id || '')

  useEffect(() => {
    if (id) {
      fetchTool(id)
    }
  }, [id])

  const fetchTool = async (toolId: string) => {
    try {
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .eq('id', toolId)
        .eq('is_active', true)
        .single()

      if (error) throw error
      setTool(data)
    } catch (error) {
      console.error('Error fetching tool:', error)
      navigate('/tools')
    } finally {
      setLoading(false)
    }
  }


  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-300 rounded w-1/4"></div>
            <div className="h-64 bg-gray-300 rounded"></div>
          </div>
        </div>
      </Layout>
    )
  }

  if (!tool) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">工具不存在</h2>
            <button
              onClick={() => navigate('/tools')}
              className="mt-4 text-primary-600 hover:text-primary-500"
            >
              返回工具列表
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <PrivateRoute>
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back button */}
          <button
            onClick={() => navigate('/tools')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回工具列表
          </button>

          {/* Tool header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{tool.name}</h1>
                <p className="text-gray-600 mb-4">{tool.description}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="bg-primary-100 text-primary-600 px-2 py-1 rounded">
                    {tool.category}
                  </span>
                  <span>{tool.usage_count} 次使用</span>
                </div>
              </div>
            </div>
          </div>

          {/* Usage status and controls */}
          <div className="space-y-4 mb-6">
            {/* Usage count display */}
            <div className={`border rounded-md px-4 py-3 ${
              remainingUses <= 5 
                ? 'bg-yellow-50 border-yellow-200 text-yellow-800' 
                : remainingUses <= 2
                ? 'bg-red-50 border-red-200 text-red-800'
                : 'bg-blue-50 border-blue-200 text-blue-800'
            }`}>
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                <div>
                  <p>您还剩余 <strong>{remainingUses}</strong> 次使用机会</p>
                  <p className="text-sm mt-1">
                    {remainingUses === 0 
                      ? '使用次数已用完，请联系管理员获取更多使用次数' 
                      : '每次点击「开始使用」将消耗1次使用机会'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Start tool button */}
            {!isToolEnabled && (
              <div className="bg-white border border-gray-200 rounded-md p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {canUseTool ? (
                      <Play className="h-6 w-6 text-green-600 mr-3" />
                    ) : (
                      <Lock className="h-6 w-6 text-red-600 mr-3" />
                    )}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">
                        {canUseTool ? '点击开始使用工具' : '无法使用工具'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {canUseTool 
                          ? '使用工具前需要先激活，这将消耗1次使用机会' 
                          : '您的使用次数不足，请联系管理员获取更多使用次数'
                        }
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={startUsingTool}
                    disabled={!canUseTool}
                    className={`px-6 py-2 rounded-md font-medium ${
                      canUseTool
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {canUseTool ? '开始使用' : '无法使用'}
                  </button>
                </div>
              </div>
            )}

            {/* Tool is activated */}
            {isToolEnabled && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md">
                <div className="flex items-center">
                  <Play className="h-5 w-5 mr-2" />
                  <div>
                    <p className="font-medium">工具已激活</p>
                    <p className="text-sm mt-1">
                      您现在可以使用下方的工具界面，刷新页面后需要重新激活
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tool interface - Render actual tool code */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">工具界面</h3>
                  <p className="text-sm text-gray-600 mt-1">这是实际的工具界面，由工具开发者提供</p>
                </div>
                {!isToolEnabled && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Lock className="h-4 w-4 mr-1" />
                    <span>需要激活后使用</span>
                  </div>
                )}
                {isToolEnabled && (
                  <div className="flex items-center text-sm text-green-600">
                    <Play className="h-4 w-4 mr-1" />
                    <span>已激活</span>
                  </div>
                )}
              </div>
            </div>
            <div className={`tool-container relative ${!isToolEnabled ? 'pointer-events-none' : ''}`}>
              {!isToolEnabled && (
                <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-10">
                  <div className="bg-white rounded-lg p-6 text-center shadow-lg">
                    <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">工具未激活</h4>
                    <p className="text-gray-600">请先点击上方的「开始使用」按钮激活工具</p>
                  </div>
                </div>
              )}
              {tool.html_code && (
                <iframe
                  srcDoc={`
                    <!DOCTYPE html>
                    <html>
                    <head>
                      <meta charset="utf-8">
                      <meta name="viewport" content="width=device-width, initial-scale=1">
                      <title>${tool.name}</title>
                      <style>
                        body { 
                          margin: 0; 
                          padding: 0; 
                          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        }
                        ${tool.css_code || ''}
                      </style>
                    </head>
                    <body>
                      ${tool.html_code}
                      <script>
                        ${isToolEnabled ? `
                          // 工具代码
                          ${tool.js_code || ''}
                          
                          // 使用次数记录
                          window.addEventListener('load', function() {
                            // 记录工具使用日志
                            fetch('/api/log-usage', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ toolId: '${tool.id}' })
                            }).catch(console.error);
                          });
                        ` : `
                          // 工具未激活，禁用所有交互
                          document.addEventListener('DOMContentLoaded', function() {
                            document.body.style.pointerEvents = 'none';
                            document.body.style.userSelect = 'none';
                          });
                        `}
                      </script>
                    </body>
                    </html>
                  `}
                  className="w-full min-h-[600px] border-0"
                  title={tool.name}
                  sandbox={isToolEnabled ? "allow-scripts allow-same-origin allow-forms allow-popups allow-modals" : "allow-scripts"}
                />
              )}
              {!tool.html_code && (
                <div className="p-8 text-center text-gray-500">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4" />
                  <p>该工具暂未配置界面代码</p>
                </div>
              )}
            </div>
          </div>

        </div>
        
        {/* QR Modal for contact admin when no usage left */}
        <QRModal 
          isOpen={showQRModal} 
          onClose={() => setShowQRModal(false)} 
        />
      </Layout>
    </PrivateRoute>
  )
}
