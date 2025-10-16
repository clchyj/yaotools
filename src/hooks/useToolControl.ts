import { useState, useEffect, useCallback } from 'react'
import { useAuthStore } from '../lib/store'
import { supabase } from '../lib/supabase'
import { eventBus, EVENTS } from '../lib/events'

export const useToolControl = (toolId: string) => {
  const { userProfile, updateUsage } = useAuthStore()
  const [isToolEnabled, setIsToolEnabled] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)

  // 检查是否可以使用工具
  const remainingUses = userProfile?.remaining_uses || 0
  const canUseTool = remainingUses > 0

  // 记录使用日志
  const logToolUsage = useCallback(async (userId: string, toolId: string) => {
    try {
      const { error } = await supabase
        .from('usage_logs')
        .insert([{
          user_id: userId,
          tool_id: toolId
        }])
      
      if (error) {
        console.error('Error logging usage:', error)
      }
    } catch (error) {
      console.error('Error logging usage:', error)
    }
  }, [])

  // 更新工具使用计数
  const updateToolUsageCount = useCallback(async (toolId: string) => {
    try {
      // 首先获取当前使用计数
      const { data: tool, error: fetchError } = await supabase
        .from('tools')
        .select('usage_count')
        .eq('id', toolId)
        .single()
        
      if (fetchError) {
        console.error('Error fetching tool usage count:', fetchError)
        return
      }
      
      // 更新使用计数
      const { error: updateError } = await supabase
        .from('tools')
        .update({ usage_count: (tool?.usage_count || 0) + 1 })
        .eq('id', toolId)
      
      if (updateError) {
        console.error('Error updating tool usage count:', updateError)
      } else {
        // 通知其他组件工具使用计数已更新
        eventBus.emit(EVENTS.TOOL_USAGE_UPDATED, { toolId, newCount: (tool?.usage_count || 0) + 1 })
      }
    } catch (error) {
      console.error('Error updating tool usage count:', error)
    }
  }, [])

  // 开始使用工具
  const startUsingTool = useCallback(async () => {
    if (!canUseTool) {
      setShowQRModal(true)
      return
    }

    const { user } = useAuthStore.getState()
    if (!user) {
      console.error('No authenticated user found')
      return
    }

    try {
      // 扣减使用次数
      await updateUsage(true)
      
      // 记录使用日志
      await logToolUsage(user.id, toolId)
      
      // 更新工具使用计数
      await updateToolUsageCount(toolId)
      
      setIsToolEnabled(true)
      
      // 保存激活状态到sessionStorage（页面刷新后失效）
      sessionStorage.setItem(`tool_${toolId}_activated`, 'true')
    } catch (error) {
      console.error('Error updating usage:', error)
    }
  }, [canUseTool, updateUsage, toolId, logToolUsage, updateToolUsageCount, remainingUses])

  // 禁用右键菜单和键盘快捷键（仅在工具未激活时）
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      if (!isToolEnabled) {
        e.preventDefault()
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // 仅在工具未激活时禁用快捷键
      if (!isToolEnabled && (
        e.ctrlKey && (e.key === 'a' || e.key === 'c' || e.key === 'v' || e.key === 'x' || e.key === 's' || e.key === 'p') ||
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'C') ||
        (e.ctrlKey && e.key === 'u')
      )) {
        e.preventDefault()
      }
    }

    // 添加事件监听器
    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('keydown', handleKeyDown)

    // 清理函数
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isToolEnabled])

  // 页面加载时检查激活状态
  useEffect(() => {
    const isActivated = sessionStorage.getItem(`tool_${toolId}_activated`) === 'true'
    setIsToolEnabled(isActivated)
  }, [toolId])

  // 控制body的class来管理全局样式
  useEffect(() => {
    const body = document.body
    
    if (isToolEnabled) {
      body.classList.remove('tool-locked')
      body.classList.add('tool-enabled')
    } else {
      body.classList.remove('tool-enabled')
      body.classList.add('tool-locked')
    }
    
    // 组件卸载时清理
    return () => {
      body.classList.remove('tool-locked', 'tool-enabled')
    }
  }, [isToolEnabled])

  // 页面离开时清理状态
  useEffect(() => {
    const handleBeforeUnload = () => {
      // 清除激活状态，下次进入需要重新激活
      sessionStorage.removeItem(`tool_${toolId}_activated`)
      document.body.classList.remove('tool-locked', 'tool-enabled')
    }

    const handlePopState = () => {
      // 浏览器前进后退时清理状态
      handleBeforeUnload()
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('popstate', handlePopState)
      // 组件卸载时也清理状态
      sessionStorage.removeItem(`tool_${toolId}_activated`)
      document.body.classList.remove('tool-locked', 'tool-enabled')
    }
  }, [toolId])

  return {
    isToolEnabled,
    canUseTool,
    remainingUses,
    startUsingTool,
    showQRModal,
    setShowQRModal
  }
}