import { useState, useEffect, useRef } from 'react'
import { Layout } from '../components/Layout'
import { PrivateRoute } from '../components/PrivateRoute'
import { useAuthStore } from '../lib/store'
import { QRModal } from '../components/QRModal'
import { supabase, type AIModel } from '../lib/supabase'
import { Send, Bot, User, Loader2, AlertCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react'

interface ChatMessage {
  id: string
  user_message: string
  ai_response: string
  timestamp: string
  isLoading?: boolean
}

// AIModel 类型现在从 supabase.ts 导入

export const AIAssistantLocal = () => {
  const { userProfile, updateUsage } = useAuthStore()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [availableModels, setAvailableModels] = useState<AIModel[]>([])
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null)
  const [loadingModels, setLoadingModels] = useState(true)
  const [refreshingModels, setRefreshingModels] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [streamMode] = useState(false) // 流式输出模式
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 使用工具控制Hook
  // 直接从store获取使用次数信息，不使用工具控制
  const [showQRModal, setShowQRModal] = useState(false)
  const remainingUses = userProfile?.remaining_uses || 0
  const canUseTool = remainingUses > 0
  useEffect(() => {
    fetchAvailableModels()
    // 从 localStorage加载聊天历史
    const savedMessages = localStorage.getItem('ai-chat-history')
    
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages))
      } catch (e) {
        console.error('Error loading chat history:', e)
      }
    }

    // 设置定时刷新模型配置（每30秒检查一次）
    const interval = setInterval(() => {
      fetchAvailableModels(true) // silent = true，不显示loading状态
    }, 30000)

    // 监听窗口焦点，当用户切回页面时刷新模型配置
    const handleFocus = () => {
      fetchAvailableModels(true) // silent = true，不显示loading状态
    }
    
    window.addEventListener('focus', handleFocus)
    
    // 设置 Supabase 实时订阅，监听 ai_models 表的变化
    const subscription = supabase
      .channel('ai_models_changes')
      .on(
        'postgres_changes',
        {
          event: '*', // 监听所有变化（增删改）
          schema: 'public',
          table: 'ai_models'
        },
        (payload) => {
          console.log('AI models changed:', payload)
          // 当数据库变化时，自动刷新模型列表
          fetchAvailableModels(true)
        }
      )
      .subscribe((status: 'SUBSCRIBED' | 'TIMED_OUT' | 'CHANNEL_ERROR' | 'CLOSED') => {
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to ai_models changes')
          setIsConnected(true)
        } else {
          console.log('Subscription status:', status)
          setIsConnected(false)
        }
      })
    
    return () => {
      clearInterval(interval)
      window.removeEventListener('focus', handleFocus)
      // 取消订阅
      subscription.unsubscribe()
    }
  }, [])

  const fetchAvailableModels = async (silent = false) => {
    try {
      const { data, error } = await supabase
        .from('ai_models')
        .select('*')
        .eq('is_active', true)
        .order('is_default', { ascending: false })

      if (error) {
        console.error('Error fetching AI models:', error)
        // 如果数据库表不存在，显示提示
        if (!silent) setLoadingModels(false)
        return
      }

      setAvailableModels(data || [])
      
      if (data && data.length > 0) {
        // 如果当前没有选中的模型，或者选中的模型不再可用
        if (!selectedModel || !data.find(m => m.id === selectedModel.id)) {
          const defaultModel = data.find(model => model.is_default) || data[0]
          setSelectedModel(defaultModel)
        } else {
          // 更新当前选中模型的配置（保持最新的参数）
          const updatedModel = data.find(m => m.id === selectedModel.id)
          if (updatedModel) {
            setSelectedModel(updatedModel)
          }
        }
      } else {
        setSelectedModel(null)
      }
    } catch (error) {
      console.error('Error fetching AI models:', error)
    } finally {
      if (!silent) setLoadingModels(false)
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // 保存聊天历史到localStorage
    if (messages.length > 0) {
      localStorage.setItem('ai-chat-history', JSON.stringify(messages))
    }
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // 配置现在从数据库获取，不需要本地配置函数

  // 流式AI调用函数
  const callAIModelStream = async (
    message: string,
    onChunk: (chunk: string) => void
  ): Promise<void> => {
    if (!selectedModel) {
      throw new Error('请等待模型加载完成')
    }

    if (!selectedModel.api_key) {
      throw new Error('模型配置中缺少API Key，请联系管理员')
    }

    console.log('Calling AI model with streaming:', {
      name: selectedModel.name,
      model_name: selectedModel.model_name,
      stream: true
    })

    try {
      const isOpenRouter = selectedModel.api_url.includes('openrouter.ai')
      
      const headers: Record<string, string> = {
        'Authorization': `Bearer ${selectedModel.api_key}`,
        'Content-Type': 'application/json'
      }
      
      if (isOpenRouter) {
        headers['HTTP-Referer'] = window.location.origin
        headers['X-Title'] = 'YaoTools AI Assistant'
      }
      
      const response = await fetch(selectedModel.api_url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: selectedModel.model_name,
          messages: [{ role: 'user', content: message }],
          max_tokens: selectedModel.max_tokens || 1000,
          temperature: selectedModel.temperature || 0.7,
          stream: true // 启用流式输出
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      if (!response.body) {
        throw new Error('响应中没有流数据')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let fullContent = ''

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (line.trim() === '') continue
            
            if (line.startsWith('data: ')) {
              const data = line.slice(6).trim()
              
              if (data === '[DONE]') {
                break
              }
              
              try {
                const parsed = JSON.parse(data)
                const content = parsed.choices?.[0]?.delta?.content
                
                if (content) {
                  fullContent += content
                  onChunk(fullContent)
                }
              } catch (parseError) {
                console.warn('解析SSE数据失败:', data)
              }
            }
          }
        }
      } finally {
        reader.releaseLock()
      }

      if (!fullContent) {
        throw new Error('未接收到有效的响应内容')
      }
    } catch (error) {
      console.error('Error in stream call:', error)
      throw error
    }
  }

  const callAIModel = async (message: string): Promise<string> => {
    if (!selectedModel) {
      throw new Error('请等待模型加载完成')
    }

    if (!selectedModel.api_key) {
      throw new Error('模型配置中缺少API Key，请联系管理员')
    }

    // 添加调试信息
    console.log('Calling AI model with config:', {
      name: selectedModel.name,
      model_name: selectedModel.model_name,
      api_url: selectedModel.api_url,
      api_key: selectedModel.api_key?.substring(0, 10) + '...',
      max_tokens: selectedModel.max_tokens,
      temperature: selectedModel.temperature
    })

    try {
      // 根据API URL决定使用哪些请求头
      const isModelScope = selectedModel.api_url.includes('modelscope.cn')
      const isOpenRouter = selectedModel.api_url.includes('openrouter.ai')
      
      const headers: Record<string, string> = {
        'Authorization': `Bearer ${selectedModel.api_key}`,
        'Content-Type': 'application/json'
      }
      
      // 只为OpenRouter添加额外请求头
      if (isOpenRouter) {
        headers['HTTP-Referer'] = window.location.origin
        headers['X-Title'] = 'YaoTools AI Assistant'
      }
      
      console.log(`Calling ${isModelScope ? 'ModelScope' : isOpenRouter ? 'OpenRouter' : 'Unknown'} API...`)
      console.log('Request headers:', Object.keys(headers))
      
      const response = await fetch(selectedModel.api_url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: selectedModel.model_name,
          messages: [{ role: 'user', content: message }],
          max_tokens: selectedModel.max_tokens || 1000,
          temperature: selectedModel.temperature || 0.7
        })
      })

      console.log('API Response status:', response.status)
      console.log('API Response headers:', Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error response:', errorText)
        
        // 检查是否返回HTML页面
        if (errorText.startsWith('<!DOCTYPE') || errorText.includes('<html>')) {
          throw new Error(`API调用被重定向到错误页面，请检查API URL和API Key是否正确`)
        }
        
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const responseText = await response.text()
      console.log('Raw API response:', responseText.substring(0, 500))

      let data
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error('JSON parse error:', parseError)
        console.error('Response text:', responseText)
        throw new Error('服务器返回的不是有效的JSON格式，可能是API URL或API Key错误')
      }

      const content = data.choices?.[0]?.message?.content
      if (!content) {
        console.error('Unexpected API response format:', data)
        throw new Error('服务器返回的数据格式不正确')
      }

      return content
    } catch (error) {
      console.error('Error calling AI model:', error)
      
      // 提供更详细的错误信息
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('网络连接失败，请检查网络连接或API URL是否可访问')
      }
      
      if (error instanceof Error) {
        throw error // 传递具体的错误信息
      }
      
      throw new Error('调用AI模型失败，请稍后重试。')
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    // 检查使用次数
    if (!canUseTool) {
      setShowQRModal(true)
      return
    }

    const userMessage = inputMessage.trim()
    setInputMessage('')
    setIsLoading(true)

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      user_message: userMessage,
      ai_response: '',
      timestamp: new Date().toISOString(),
      isLoading: true
    }

    setMessages(prev => [...prev, newMessage])

    try {
      // 先扣减使用次数
      await updateUsage(true)
      
      if (streamMode) {
        // 流式输出
        await callAIModelStream(userMessage, (chunk) => {
          setMessages(prev => 
            prev.map(msg => 
              msg.id === newMessage.id 
                ? { ...msg, ai_response: chunk, isLoading: false }
                : msg
            )
          )
        })
      } else {
        // 普通输出
        const aiResponse = await callAIModel(userMessage)
        setMessages(prev => 
          prev.map(msg => 
            msg.id === newMessage.id 
              ? { ...msg, ai_response: aiResponse, isLoading: false }
              : msg
          )
        )
      }
    } catch (error) {
      console.error('Error sending message:', error)
      
      // API调用失败，恢复使用次数
      try {
        await updateUsage(false) // false 表示增加1次使用次数
      } catch (restoreError) {
        console.error('Error restoring usage:', restoreError)
      }
      
      // 显示错误消息
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id 
            ? { 
                ...msg, 
                ai_response: error instanceof Error ? error.message : '发送失败，请重试', 
                isLoading: false 
              }
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

  const clearHistory = () => {
    setMessages([])
    localStorage.removeItem('ai-chat-history')
  }

  const refreshModels = async () => {
    setRefreshingModels(true)
    await fetchAvailableModels()
    setRefreshingModels(false)
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
          <div className="mb-6">
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
          </div>

          {/* 模型选择器 */}
          {availableModels.length > 0 && (
            <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <label className="block text-sm font-medium text-gray-700 mr-2">
                    当前AI模型
                  </label>
                  {isConnected ? (
                    <div className="flex items-center text-green-600" title="已连接到数据库，实时同步">
                      <Wifi className="h-3 w-3" />
                    </div>
                  ) : (
                    <div className="flex items-center text-gray-400" title="未连接到实时同步">
                      <WifiOff className="h-3 w-3" />
                    </div>
                  )}
                </div>
                {selectedModel && (
                  <span className="text-xs text-gray-500">
                    最大Token: {selectedModel.max_tokens} | 温度: {selectedModel.temperature}
                  </span>
                )}
              </div>
              
              {availableModels.length > 1 ? (
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
                      {model.is_default && ' - 默认'}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="text-sm text-gray-600">
                  {selectedModel ? (
                    <span>{selectedModel.name} ({selectedModel.model_name})</span>
                  ) : (
                    <span>加载中...</span>
                  )}
                </div>
              )}
              
              {selectedModel?.description && (
                <p className="text-xs text-gray-500 mt-2">{selectedModel.description}</p>
              )}
            </div>
          )}

          {/* Chat container */}
              <div className="bg-white rounded-lg border border-gray-200 h-96 flex flex-col">
                {/* Chat header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center">
                    <Bot className="h-6 w-6 text-primary-600 mr-2" />
                    <h3 className="text-lg font-medium text-gray-900">
                      {selectedModel ? selectedModel.name : '加载中...'}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={refreshModels}
                      disabled={refreshingModels}
                      className="text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 flex items-center"
                      title="刷新模型配置"
                    >
                      <RefreshCw className={`h-4 w-4 mr-1 ${refreshingModels ? 'animate-spin' : ''}`} />
                      刷新
                    </button>
                    {messages.length > 0 && (
                      <button
                        onClick={clearHistory}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        清空历史
                      </button>
                    )}
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <Bot className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p>开始与AI对话吧！发送一条消息来开始。</p>
                      {loadingModels && (
                        <p className="text-sm text-gray-500 mt-2">
                          正在加载可用的AI模型...
                        </p>
                      )}
                      {!loadingModels && availableModels.length === 0 && (
                        <p className="text-sm text-red-500 mt-2">
                          暂无可用的AI模型，请联系管理员配置
                        </p>
                      )}
                      {!canUseTool && selectedModel && (
                        <p className="text-sm text-red-500 mt-2">
                          使用次数不足，请联系管理员获取更多使用次数
                        </p>
                      )}
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
                        placeholder={
                          !canUseTool 
                            ? "使用次数不足，无法发送消息" 
                            : !selectedModel 
                            ? "加载模型中..."
                            : "输入您的问题..."
                        }
                        disabled={isLoading || !selectedModel || !canUseTool}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        rows={2}
                      />
                    </div>
                    <button
                      onClick={sendMessage}
                      disabled={!inputMessage.trim() || isLoading || !selectedModel || !canUseTool}
                      title={
                        !canUseTool 
                          ? '使用次数不足' 
                          : !selectedModel 
                          ? '模型加载中' 
                          : '发送消息'
                      }
                      className={`p-2 rounded-md ${
                        !inputMessage.trim() || isLoading || !selectedModel || !canUseTool
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

          {/* 配置现在由管理员在后台管理 */}

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