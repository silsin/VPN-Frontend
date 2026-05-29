import { defineStore } from 'pinia'
import timerService from '../services/timers.js'

export const useTimersStore = defineStore('timers', {
  state: () => ({
    configurations: {},
    statuses: {},
    events: [],
    loading: false,
    error: null
  }),

  getters: {
    // Get all configurations
    allConfigurations: (state) => state.configurations,
    
    // Get all statuses
    allStatuses: (state) => state.statuses,
    
    // Get all events
    allEvents: (state) => state.events,
    
    // Get configurations by category
    timersByCategory: (state) => {
      const categorized = {}
      
      Object.values(state.configurations).forEach(config => {
        if (!categorized[config.category]) {
          categorized[config.category] = {}
        }
        categorized[config.category][config.id] = config
      })
      
      return categorized
    },
    
    // Get active timers
    activeTimers: (state) => {
      return Object.values(state.statuses).filter(status => status.status === 'running')
    },
    
    // Get timers with errors
    errorTimers: (state) => {
      return Object.values(state.statuses).filter(status => status.status === 'error')
    },
    
    // Get timer by ID
    getTimerById: (state) => (timerId) => {
      return {
        config: state.configurations[timerId],
        status: state.statuses[timerId]
      }
    }
  },

  actions: {
    // Fetch all timer configurations
    async fetchConfigurations() {
      try {
        this.loading = true
        const data = await timerService.getTimerConfigs()
        
        // Flatten the nested structure
        const flatConfigs = {}
        if (data.timer_configs) {
          Object.entries(data.timer_configs).forEach(([category, timers]) => {
            Object.entries(timers).forEach(([timerId, config]) => {
              flatConfigs[timerId] = {
                ...config,
                id: timerId,
                category
              }
            })
          })
        }
        
        this.configurations = flatConfigs
      } catch (error) {
        this.error = error.message
        console.error('Failed to fetch timer configurations:', error)
      } finally {
        this.loading = false
      }
    },

    // Update timer configurations
    async updateTimerConfig(updates) {
      try {
        this.loading = true
        
        // Ensure updates is an array
        const updatesArray = Array.isArray(updates) ? updates : [updates]
        
        const result = await timerService.updateTimerConfigs(updatesArray)
        
        // Update local state
        updatesArray.forEach(update => {
          if (this.configurations[update.timer_id]) {
            Object.assign(this.configurations[update.timer_id], update)
          }
        })
        
        return result
      } catch (error) {
        this.error = error.message
        console.error('Failed to update timer configurations:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Fetch timer statuses
    async fetchStatuses() {
      try {
        this.loading = true
        const data = await timerService.getTimerStatus()
        
        // Convert array to object for easier access
        const statusMap = {}
        if (Array.isArray(data)) {
          data.forEach(status => {
            statusMap[status.timer_id] = status
          })
        } else if (data && typeof data === 'object') {
          Object.entries(data).forEach(([timerId, status]) => {
            statusMap[timerId] = status
          })
        }
        
        this.statuses = statusMap
      } catch (error) {
        this.error = error.message
        console.error('Failed to fetch timer statuses:', error)
      } finally {
        this.loading = false
      }
    },

    // Control timer
    async controlTimer(timerId, action) {
      try {
        const result = await timerService.controlTimer(timerId, action)
        
        // Update local status
        if (this.statuses[timerId]) {
          this.statuses[timerId].status = action === 'start' ? 'running' : 
                                          action === 'stop' ? 'stopped' : 
                                          action === 'pause' ? 'paused' : 'stopped'
        }
        
        return result
      } catch (error) {
        this.error = error.message
        console.error(`Failed to control timer ${timerId}:`, error)
        throw error
      }
    },

    // Fetch timer events
    async fetchEvents() {
      try {
        this.loading = true
        const data = await timerService.getTimerEvents()
        this.events = Array.isArray(data) ? data : []
      } catch (error) {
        this.error = error.message
        console.error('Failed to fetch timer events:', error)
      } finally {
        this.loading = false
      }
    },

    // Add event to local state
    addEvent(event) {
      this.events.unshift(event)
      
      // Keep only last 100 events
      if (this.events.length > 100) {
        this.events = this.events.slice(0, 100)
      }
    },

    // Update timer status (for WebSocket updates)
    updateTimerStatus(timerId, status) {
      this.statuses[timerId] = { ...this.statuses[timerId], ...status }
    },

    // Update timer configuration (for WebSocket updates)
    updateTimerConfiguration(timerId, config) {
      if (this.configurations[timerId]) {
        this.configurations[timerId] = { ...this.configurations[timerId], ...config }
      }
    },

    // Clear error
    clearError() {
      this.error = null
    },

    // Reset store
    reset() {
      this.configurations = {}
      this.statuses = {}
      this.events = []
      this.loading = false
      this.error = null
    }
  }
})
