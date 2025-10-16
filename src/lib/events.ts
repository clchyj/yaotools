// 简单的事件发射器，用于在组件间通信
class EventEmitter {
  private events: { [key: string]: Function[] } = {}

  on(event: string, callback: Function) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(callback)
  }

  off(event: string, callback: Function) {
    if (!this.events[event]) return
    this.events[event] = this.events[event].filter(cb => cb !== callback)
  }

  emit(event: string, data?: any) {
    if (!this.events[event]) return
    this.events[event].forEach(callback => callback(data))
  }
}

export const eventBus = new EventEmitter()

// 事件类型
export const EVENTS = {
  TOOL_USAGE_UPDATED: 'tool_usage_updated',
} as const