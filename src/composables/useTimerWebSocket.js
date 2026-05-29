import { ref, onMounted, onUnmounted } from 'vue'
import { useTimersStore } from '../stores/timers.js'
import timerService from '../services/timers.js'

export function useTimerWebSocket() {
  const timersStore = useTimersStore()
  const isConnected = ref(false)
  const connectionStatus = ref('disconnected')
  const ws = ref(null)
  const reconnectAttempts = ref(0)
  const maxReconnectAttempts = 5
  const reconnectInterval = 3000
  let reconnectTimer = null

  const connect = () => {
    try {
      ws.value = timerService.createWebSocketConnection()
      connectionStatus.value = 'connecting'
      
      ws.value.onopen = () => {
        isConnected.value = true
        connectionStatus.value = 'connected'
        reconnectAttempts.value = 0
        console.log('Timer WebSocket connected')
        
        // Start heartbeat
        startHeartbeat()
      }
      
      ws.value.onclose = (event) => {
        isConnected.value = false
        connectionStatus.value = 'disconnected'
        console.log('Timer WebSocket disconnected:', event.code, event.reason)
        
        // Attempt to reconnect
        if (reconnectAttempts.value < maxReconnectAttempts) {
          scheduleReconnect()
        }
      }
      
      ws.value.onerror = (error) => {
        console.error('Timer WebSocket error:', error)
        connectionStatus.value = 'error'
      }
      
      ws.value.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          handleWebSocketMessage(data)
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error)
        }
      }
      
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error)
      connectionStatus.value = 'error'
      scheduleReconnect()
    }
  }

  const disconnect = () => {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
      reconnectTimer = null
    }
    
    if (ws.value) {
      ws.value.close()
      ws.value = null
    }
    
    isConnected.value = false
    connectionStatus.value = 'disconnected'
  }

  const scheduleReconnect = () => {
    if (reconnectTimer) return
    
    reconnectAttempts.value++
    const delay = reconnectInterval * Math.pow(2, reconnectAttempts.value - 1) // Exponential backoff
    
    console.log(`Scheduling reconnect attempt ${reconnectAttempts.value} in ${delay}ms`)
    
    reconnectTimer = setTimeout(() => {
      reconnectTimer = null
      connect()
    }, delay)
  }

  const startHeartbeat = () => {
    const heartbeatInterval = setInterval(() => {
      if (ws.value && ws.value.readyState === WebSocket.OPEN) {
        ws.value.send(JSON.stringify({ type: 'ping' }))
      } else {
        clearInterval(heartbeatInterval)
      }
    }, 30000) // Send ping every 30 seconds
  }

  const handleWebSocketMessage = (data) => {
    switch (data.type) {
      case 'timer_status_update':
        timersStore.updateTimerStatus(data.timer_id, data.status)
        break
        
      case 'timer_config_update':
        timersStore.updateTimerConfiguration(data.timer_id, data.config)
        break
        
      case 'timer_event':
        timersStore.addEvent(data.event)
        break
        
      case 'pong':
        // Heartbeat response
        break
        
      case 'error':
        console.error('WebSocket error message:', data.message)
        break
        
      default:
        console.log('Unknown WebSocket message type:', data.type, data)
    }
  }

  const send = (message) => {
    if (ws.value && ws.value.readyState === WebSocket.OPEN) {
      ws.value.send(JSON.stringify(message))
    } else {
      console.warn('WebSocket not connected, cannot send message:', message)
    }
  }

  // Auto-connect on mount
  onMounted(() => {
    connect()
  })

  // Cleanup on unmount
  onUnmounted(() => {
    disconnect()
  })

  return {
    isConnected,
    connectionStatus,
    reconnectAttempts,
    connect,
    disconnect,
    send
  }
}

// Composable for timer control
export function useTimerControl() {
  const timersStore = useTimersStore()
  
  const startTimer = async (timerId) => {
    return await timersStore.controlTimer(timerId, 'start')
  }
  
  const stopTimer = async (timerId) => {
    return await timersStore.controlTimer(timerId, 'stop')
  }
  
  const pauseTimer = async (timerId) => {
    return await timersStore.controlTimer(timerId, 'pause')
  }
  
  const resetTimer = async (timerId) => {
    return await timersStore.controlTimer(timerId, 'reset')
  }
  
  return {
    startTimer,
    stopTimer,
    pauseTimer,
    resetTimer
  }
}

// Composable for timer events
export function useTimerEvents() {
  const timersStore = useTimersStore()
  
  const fetchEvents = async () => {
    return await timersStore.fetchEvents()
  }
  
  const clearEvents = () => {
    timersStore.events = []
  }
  
  return {
    events: timersStore.allEvents,
    fetchEvents,
    clearEvents
  }
}

// Composable for timer health monitoring
export function useTimerHealth() {
  const timersStore = useTimersStore()
  
  const systemHealth = computed(() => {
    const total = Object.keys(timersStore.configurations).length
    const active = timersStore.activeTimers.length
    const errors = timersStore.errorTimers.length
    
    let status = 'healthy'
    if (errors > 0) {
      status = 'error'
    } else if (active === 0) {
      status = 'inactive'
    } else if (active < total / 2) {
      status = 'degraded'
    }
    
    return {
      total,
      active,
      errors,
      status
    }
  })
  
  const isHealthy = computed(() => systemHealth.value.status === 'healthy')
  const healthStatus = computed(() => systemHealth.value.status)
  const healthColor = computed(() => {
    const colors = {
      'healthy': '#10b981',
      'degraded': '#f59e0b',
      'error': '#ef4444',
      'inactive': '#6b7280'
    }
    return colors[systemHealth.value.status] || '#9ca3af'
  })
  
  const criticalTimers = computed(() => {
    return Object.entries(timersStore.configurations)
      .filter(([timerId, config]) => {
        const status = timersStore.statuses[timerId]
        return status && (status.status === 'error' || status.status === 'running')
      })
      .map(([timerId, config]) => ({
        id: timerId,
        config,
        status: timersStore.statuses[timerId]
      }))
  })
  
  return {
    systemHealth,
    isHealthy,
    healthStatus,
    healthColor,
    criticalTimers
  }
}
