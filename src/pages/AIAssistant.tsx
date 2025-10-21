import { useState, useEffect, useRef } from 'react'
import { Layout } from '../components/Layout'
import { PrivateRoute } from '../components/PrivateRoute'
import { useAuthStore } from '../lib/store'
import { useToolControl } from '../hooks/useToolControl'
import { QRModal } from '../components/QRModal'
import { supabase, type AIModel, type ChatMessage } from '../lib/supabase'
import { useAuthStore as useAuthStoreForUsage } from '../lib/store'
import { Send, Bot, User, Loader2, Play, Lock, AlertCircle } from 'lucide-react'

export const AIAssistant = () => {
  const { user } = useAuthStore()
  const { updateUsage } = useAuthStoreForUsage()
  const [messages, setMessages] = useState<(ChatMessage & { isLoading?: boolean })[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [availableModels, setAvailableModels] = useState<AIModel[]>([])
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null)
  const [loadingModels, setLoadingModels] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 使用工具控制Hook (AI助手也作为一个工具)
  const {
    isToolEnabled,
    canUseTool,
    remainingUses,
    startUsingTool,
    showQRModal,
    setShowQRModal
  } = useToolControl('ai-assistant')

  useEffect(() => {
    fetchAvailableModels()
    if (user && isToolEnabled) {
      fetchChatHistory()
    }
  }, [user, isToolEnabled])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchAvailableModels = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_models')
        .select('*')
        .eq('is_active', true)
        .order('is_default', { ascending: false })

      if (error) throw error

      setAvailableModels(data || [])
      if (data && data.length > 0) {
        // 选择默认模型或第一个可用模型
        const defaultModel = data.find(model => model.is_default) || data[0]
        setSelectedModel(defaultModel)
      }
    } catch (error) {
      console.error('Error fetching AI models:', error)
    } finally {
      setLoadingModels(false)
    }
  }

  const fetchChatHistory = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          *,
          ai_models (
            name,
            model_name
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
        .limit(50) // 限制最近50条消息

      if (error) throw error

      setMessages(data || [])
    } catch (error) {
      console.error('Error fetching chat history:', error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const callAIModel = async (message: string, model: AIModel): Promise<string> => {
    try {
      const response = await fetch(model.api_url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${model.api_key}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'YaoTools AI Assistant',
        },
        body: JSON.stringify({
          model: model.model_name,
          messages: [
            {
              role: 'user',
              content: message
            }
          ],
          max_tokens: model.max_tokens || 1000,
          temperature: model.temperature || 0.7
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.choices?.[0]?.message?.content || '抱歉，我无法生成回复。'
    } catch (error) {
      console.error('Error calling AI model:', error)
      throw new Error('调用AI模型失败，请稍后重试。')
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || !selectedModel || !user || isLoading) return

    // 检查使用次数
    if (!canUseTool) {
      setShowQRModal(true)
      return
    }

    const userMessage = inputMessage.trim()
    setInputMessage('')
    setIsLoading(true)

    // 添加用户消息到界面
    const tempUserMessage: ChatMessage & { isLoading?: boolean } = {
      id: `temp-user-${Date.now()}`,
      user_id: user.id,
      model_id: selectedModel.id,
      user_message: userMessage,
      ai_response: '',
      created_at: new Date().toISOString()
    }

    // 添加加载中的AI回复
    const tempAIMessage: ChatMessage & { isLoading?: boolean } = {
      id: `temp-ai-${Date.now()}`,
      user_id: user.id,
      model_id: selectedModel.id,
      user_message: userMessage,
      ai_response: '',
      isLoading: true,
      created_at: new Date().toISOString()
    }

    setMessages(prev => [...prev, tempUserMessage, tempAIMessage])

    try {
      // 调用AI模型
      const aiResponse = await callAIModel(userMessage, selectedModel)

      // 保存到数据库
      const { data, error } = await supabase
        .from('chat_messages')
        .insert([{
          user_id: user.id,
          model_id: selectedModel.id,
          user_message: userMessage,
          ai_response: aiResponse
        }])
        .select()
        .single()

      if (error) throw error

      // 扣减使用次数
      await updateUsage(true)

      // 更新消息列表
      setMessages(prev => 
        prev.map(msg => 
          msg.id === tempAIMessage.id 
            ? { ...data, isLoading: false }
            : msg.id === tempUserMessage.id
            ? data // 替换临时用户消息
            : msg
        ).filter(msg => msg.id !== tempUserMessage.id) // 移除临时用户消息，因为已经被数据库返回的消息替换
      )

    } catch (error) {
      console.error('Error sending message:', error)
      
      // 移除加载中的消息，显示错误
      setMessages(prev => 
        prev.map(msg => 
          msg.id === tempAIMessage.id 
            ? { ...msg, ai_response: error instanceof Error ? error.message : '发送失败，请重试', isLoading: false }
            : msg
        )
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearHistory = async () => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('user_id', user.id)

      if (error) throw error

      setMessages([])
    } catch (error) {
      console.error('Error clearing chat history:', error)
    }
  }

  if (loadingModels) {
    return (
      <PrivateRoute>
        <Layout>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-300 rounded w-1/4"></div>
              <div className="h-64 bg-gray-300 rounded"></div>
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
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AI助手</h1>
            <p className="text-gray-600">与AI进行智能对话，获得专业的建议和帮助</p>
          </div>

          {/* Usage status */}
          <div className="space-y-4 mb-6">
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
                      : '每次发送消息将消耗1次使用机会'
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
                        {canUseTool ? '点击开始使用AI助手' : '无法使用AI助手'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {canUseTool 
                          ? '开始与AI对话前需要先激活，这将消耗1次使用机会' 
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
          </div>

          {isToolEnabled && (
            <>
              {/* Model selector */}
              {availableModels.length > 0 && (
                <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    选择AI模型
                  </label>
                  <select
                    value={selectedModel?.id || ''}
                    onChange={(e) => {
                      const model = availableModels.find(m => m.id === e.target.value)
                      setSelectedModel(model || null)
                    }}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {availableModels.map(model => (
                      <option key={model.id} value={model.id}>
                        {model.name} ({model.model_name})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Chat container */}
              <div className="bg-white rounded-lg border border-gray-200 h-96 flex flex-col">
                {/* Chat header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center">
                    <Bot className="h-6 w-6 text-primary-600 mr-2" />
                    <h3 className="text-lg font-medium text-gray-900">
                      {selectedModel ? selectedModel.name : '请选择AI模型'}
                    </h3>
                  </div>
                  {messages.length > 0 && (
                    <button
                      onClick={clearHistory}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      清空历史
                    </button>
                  )}
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <Bot className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p>开始与AI对话吧！发送一条消息来开始。</p>
                    </div>
                  ) : (
                    <>
                      {messages.map((message) => (
                        <div key={message.id} className="space-y-4">
                          {/* User message */}
                          <div className="flex items-start justify-end">
                            <div className="max-w-xs lg:max-w-md bg-primary-600 text-white rounded-lg px-4 py-2">
                              <p className="text-sm">{message.user_message}</p>
                            </div>
                            <User className="h-6 w-6 text-gray-400 ml-2 mt-1" />
                          </div>

                          {/* AI message */}
                          <div className="flex items-start">
                            <Bot className="h-6 w-6 text-primary-600 mr-2 mt-1" />
                            <div className="max-w-xs lg:max-w-md bg-gray-100 rounded-lg px-4 py-2">
                              {message.isLoading ? (
                                <div className="flex items-center">
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                  <span className="text-sm text-gray-600">思考中...</span>
                                </div>
                              ) : (
                                <p className="text-sm text-gray-900 whitespace-pre-wrap">
                                  {message.ai_response}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 relative">
                      <textarea
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="输入您的问题..."
                        disabled={isLoading || !selectedModel}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        rows={2}
                      />
                    </div>
                    <button
                      onClick={sendMessage}
                      disabled={!inputMessage.trim() || isLoading || !selectedModel}
                      className={`p-2 rounded-md ${
                        !inputMessage.trim() || isLoading || !selectedModel
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-primary-600 text-white hover:bg-primary-700'
                      }`}
                    >
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Send className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* QR Modal */}
          <QRModal 
            isOpen={showQRModal} 
            onClose={() => setShowQRModal(false)} 
          />
        </div>
      </Layout>
    </PrivateRoute>
  )
}