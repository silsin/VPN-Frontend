import api from './api.js'

class TimerService {
  // Get all timer configurations
  async getTimerConfigs() {
    try {
      const response = await api.get('/timers/config')
      return response.data
    } catch (error) {
      console.error('Failed to fetch timer configs:', error)
      throw error
    }
  }

  // Update timer configurations
  async updateTimerConfigs(configs) {
    try {
      const response = await api.put('/timers/config', configs)
      return response.data
    } catch (error) {
      console.error('Failed to update timer configs:', error)
      throw error
    }
  }

  // Get timer statuses
  async getTimerStatus() {
    try {
      const response = await api.get('/timers/status')
      return response.data
    } catch (error) {
      console.error('Failed to fetch timer status:', error)
      throw error
    }
  }

  // Control timer (start/stop/pause/reset)
  async controlTimer(timerId, action) {
    try {
      const response = await api.post(`/timers/${timerId}/control`, { action })
      return response.data
    } catch (error) {
      console.error(`Failed to ${action} timer ${timerId}:`, error)
      throw error
    }
  }

  // Get timer events
  async getTimerEvents() {
    try {
      const response = await api.get('/timers/events')
      return response.data
    } catch (error) {
      console.error('Failed to fetch timer events:', error)
      throw error
    }
  }

  // Export configurations
  async exportConfigurations() {
    try {
      const response = await api.get('/timers/export', {
        responseType: 'blob'
      })
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'timer-configs.json')
      document.body.appendChild(link)
      link.click()
      link.remove()
      
      return response.data
    } catch (error) {
      console.error('Failed to export configurations:', error)
      throw error
    }
  }

  // Import configurations
  async importConfigurations(file) {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await api.post('/timers/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      return response.data
    } catch (error) {
      console.error('Failed to import configurations:', error)
      throw error
    }
  }

  // Format duration
  formatDuration(seconds) {
    if (!seconds || seconds < 0) return '00:00:00'
    
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Get timer status color
  getTimerStatusColor(status) {
    const colors = {
      'running': '#10b981',
      'stopped': '#6b7280',
      'paused': '#f59e0b',
      'error': '#ef4444',
      'warning': '#f59e0b',
      'connecting': '#3b82f6',
      'disconnected': '#ef4444',
      'healthy': '#10b981',
      'degraded': '#f59e0b',
      'inactive': '#6b7280',
      'unknown': '#9ca3af'
    }
    return colors[status] || colors.unknown
  }

  // WebSocket connection
  createWebSocketConnection() {
    const wsUrl = `${import.meta.env.VITE_WS_BASE_URL || 'wss://fly-api.online'}/ws/timers`
    const token = localStorage.getItem('token')
    
    const ws = new WebSocket(`${wsUrl}?token=${token}`)
    
    ws.onopen = () => {
      console.log('Timer WebSocket connected')
    }
    
    ws.onclose = () => {
      console.log('Timer WebSocket disconnected')
    }
    
    ws.onerror = (error) => {
      console.error('Timer WebSocket error:', error)
    }
    
    return ws
  }
}

export default new TimerService()
