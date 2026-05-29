<template>
  <div class="timer-display" :class="timerClasses">
    <!-- Timer Header -->
    <div class="timer-header">
      <div class="timer-info">
        <h3 class="timer-title">{{ title }}</h3>
        <p class="timer-description" v-if="description">{{ description }}</p>
      </div>
      <div class="timer-status">
        <StatusIndicator
          :status="timerStatus"
          :title="title"
          :size="'small'"
          :show-details="false"
          :pulse="timerStatus === 'running'"
        />
      </div>
    </div>

    <!-- Timer Countdown -->
    <div class="timer-countdown" v-if="showCountdown && remainingTime !== null">
      <div class="countdown-display">
        <span class="countdown-value">{{ formattedTime }}</span>
        <div class="countdown-label" v-if="showLabel">Time Remaining</div>
      </div>
      
      <!-- Progress Bar -->
      <div class="progress-bar" v-if="showProgress && totalTime > 0">
        <div 
          class="progress-fill" 
          :style="{ width: progressPercentage + '%' }"
          :class="progressClasses"
        ></div>
      </div>
    </div>

    <!-- Timer Controls -->
    <div class="timer-controls" v-if="showControls">
      <button 
        @click="handleStart"
        class="control-btn start-btn"
        :disabled="loading || timerStatus === 'running'"
        v-if="canStart"
      >
        <span class="btn-icon">▶️</span>
        Start
      </button>
      
      <button 
        @click="handleStop"
        class="control-btn stop-btn"
        :disabled="loading || timerStatus === 'stopped'"
        v-if="canStop"
      >
        <span class="btn-icon">⏹️</span>
        Stop
      </button>
      
      <button 
        @click="handlePause"
        class="control-btn pause-btn"
        :disabled="loading || timerStatus !== 'running'"
        v-if="canPause"
      >
        <span class="btn-icon">⏸️</span>
        Pause
      </button>
      
      <button 
        @click="handleReset"
        class="control-btn reset-btn"
        :disabled="loading"
        v-if="canReset"
      >
        <span class="btn-icon">🔄</span>
        Reset
      </button>
    </div>

    <!-- Timer Details -->
    <div class="timer-details" v-if="showDetails && config">
      <div class="detail-row">
        <span class="detail-label">Category:</span>
        <span class="detail-value">{{ formatCategory(config.category) }}</span>
      </div>
      <div class="detail-row" v-if="config.interval_seconds">
        <span class="detail-label">Interval:</span>
        <span class="detail-value">{{ config.interval_seconds }}s</span>
      </div>
      <div class="detail-row" v-if="config.duration_seconds">
        <span class="detail-label">Duration:</span>
        <span class="detail-value">{{ config.duration_seconds }}s</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Backend Control:</span>
        <span class="detail-value" :class="config.backend_control ? 'enabled' : 'disabled'">
          {{ config.backend_control ? 'Enabled' : 'Disabled' }}
        </span>
      </div>
      <div class="detail-row" v-if="lastUpdate">
        <span class="detail-label">Last Update:</span>
        <span class="detail-value">{{ formattedLastUpdate }}</span>
      </div>
    </div>

    <!-- Configuration Panel -->
    <div class="timer-config" v-if="showConfig && config">
      <h4 class="config-title">Configuration</h4>
      
      <div class="config-form">
        <div class="form-group">
          <label class="form-label">Enabled</label>
          <input 
            type="checkbox" 
            v-model="localConfig.enabled"
            @change="handleConfigChange"
            class="form-checkbox"
          />
        </div>
        
        <div class="form-group">
          <label class="form-label">Backend Control</label>
          <input 
            type="checkbox" 
            v-model="localConfig.backend_control"
            @change="handleConfigChange"
            class="form-checkbox"
          />
        </div>
        
        <div class="form-group" v-if="config.interval_seconds !== undefined">
          <label class="form-label">Interval (seconds)</label>
          <input 
            type="number" 
            v-model.number="localConfig.interval_seconds"
            @change="handleConfigChange"
            :min="minInterval"
            :max="maxInterval"
            class="form-input"
          />
        </div>
        
        <div class="form-group" v-if="config.duration_seconds !== undefined">
          <label class="form-label">Duration (seconds)</label>
          <input 
            type="number" 
            v-model.number="localConfig.duration_seconds"
            @change="handleConfigChange"
            :min="minDuration"
            :max="maxDuration"
            class="form-input"
          />
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div class="loading-overlay" v-if="loading">
      <div class="loading-spinner"></div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import { useTimersStore } from '../stores/timers.js'
import { useTimerControl } from '../composables/useTimerWebSocket.js'
import StatusIndicator from './StatusIndicator.vue'
import timerService from '../services/timers.js'

export default {
  name: 'TimerDisplay',
  components: {
    StatusIndicator
  },
  props: {
    timerId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    showControls: {
      type: Boolean,
      default: true
    },
    showDetails: {
      type: Boolean,
      default: true
    },
    showConfig: {
      type: Boolean,
      default: false
    },
    showCountdown: {
      type: Boolean,
      default: true
    },
    showProgress: {
      type: Boolean,
      default: true
    },
    showLabel: {
      type: Boolean,
      default: true
    },
    minDuration: {
      type: Number,
      default: 1
    },
    maxDuration: {
      type: Number,
      default: 86400
    },
    minInterval: {
      type: Number,
      default: 1
    },
    maxInterval: {
      type: Number,
      default: 3600
    }
  },
  emits: ['control', 'config-change'],
  setup(props, { emit }) {
    const timersStore = useTimersStore()
    const { startTimer, stopTimer, pauseTimer, resetTimer } = useTimerControl()
    
    // State
    const loading = ref(false)
    const localConfig = ref({})
    
    // Computed
    const config = computed(() => timersStore.configurations[props.timerId])
    const status = computed(() => timersStore.statuses[props.timerId])
    
    const timerStatus = computed(() => {
      return status.value?.status || 'stopped'
    })
    
    const remainingTime = computed(() => {
      return status.value?.remaining_seconds || null
    })
    
    const totalTime = computed(() => {
      return config.value?.duration_seconds || 0
    })
    
    const progressPercentage = computed(() => {
      if (totalTime.value === 0) return 0
      const elapsed = totalTime.value - (remainingTime.value || 0)
      return Math.min(100, Math.max(0, (elapsed / totalTime.value) * 100))
    })
    
    const formattedTime = computed(() => {
      if (remainingTime.value === null) return '--:--:--'
      return timerService.formatDuration(remainingTime.value)
    })
    
    const formattedLastUpdate = computed(() => {
      if (!status.value?.last_updated) return 'Never'
      
      const date = new Date(status.value.last_updated)
      const now = new Date()
      const diff = now - date
      
      if (diff < 60000) return 'Just now'
      if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
      if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
      return date.toLocaleDateString()
    })
    
    const timerClasses = computed(() => ({
      'timer-running': timerStatus.value === 'running',
      'timer-stopped': timerStatus.value === 'stopped',
      'timer-paused': timerStatus.value === 'paused',
      'timer-error': timerStatus.value === 'error'
    }))
    
    const progressClasses = computed(() => ({
      'progress-warning': progressPercentage.value < 30,
      'progress-danger': progressPercentage.value < 10
    }))
    
    const canStart = computed(() => ['stopped', 'paused'].includes(timerStatus.value))
    const canStop = computed(() => ['running', 'paused'].includes(timerStatus.value))
    const canPause = computed(() => timerStatus.value === 'running')
    const canReset = computed(() => true)
    
    // Methods
    const handleStart = async () => {
      try {
        loading.value = true
        await startTimer(props.timerId)
        emit('control', { action: 'start', timerId: props.timerId })
      } catch (error) {
        console.error('Failed to start timer:', error)
      } finally {
        loading.value = false
      }
    }
    
    const handleStop = async () => {
      try {
        loading.value = true
        await stopTimer(props.timerId)
        emit('control', { action: 'stop', timerId: props.timerId })
      } catch (error) {
        console.error('Failed to stop timer:', error)
      } finally {
        loading.value = false
      }
    }
    
    const handlePause = async () => {
      try {
        loading.value = true
        await pauseTimer(props.timerId)
        emit('control', { action: 'pause', timerId: props.timerId })
      } catch (error) {
        console.error('Failed to pause timer:', error)
      } finally {
        loading.value = false
      }
    }
    
    const handleReset = async () => {
      try {
        loading.value = true
        await resetTimer(props.timerId)
        emit('control', { action: 'reset', timerId: props.timerId })
      } catch (error) {
        console.error('Failed to reset timer:', error)
      } finally {
        loading.value = false
      }
    }
    
    const handleConfigChange = () => {
      const changes = {
        timer_id: props.timerId,
        ...localConfig.value
      }
      
      emit('config-change', changes)
    }
    
    const formatCategory = (category) => {
      const formatted = {
        'connection_management': 'Connection Management',
        'statistics': 'Statistics',
        'monitoring': 'Monitoring',
        'ui_performance': 'UI Performance',
        'general': 'General'
      }
      return formatted[category] || category
    }
    
    // Watchers
    watch(config, (newConfig) => {
      if (newConfig) {
        localConfig.value = { ...newConfig }
      }
    }, { immediate: true })
    
    // Lifecycle
    onMounted(() => {
      if (config.value) {
        localConfig.value = { ...config.value }
      }
    })
    
    return {
      // State
      loading,
      localConfig,
      
      // Computed
      config,
      status,
      timerStatus,
      remainingTime,
      totalTime,
      progressPercentage,
      formattedTime,
      formattedLastUpdate,
      timerClasses,
      progressClasses,
      canStart,
      canStop,
      canPause,
      canReset,
      
      // Methods
      handleStart,
      handleStop,
      handlePause,
      handleReset,
      handleConfigChange,
      formatCategory
    }
  }
}
</script>

<style scoped>
.timer-display {
  background: white;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.timer-display:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.timer-running {
  border-color: #10b981;
}

.timer-stopped {
  border-color: #6b7280;
}

.timer-paused {
  border-color: #f59e0b;
}

.timer-error {
  border-color: #ef4444;
}

.timer-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.timer-info h3 {
  margin: 0 0 4px 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.timer-description {
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.4;
}

.timer-countdown {
  margin-bottom: 16px;
}

.countdown-display {
  text-align: center;
  margin-bottom: 12px;
}

.countdown-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  font-family: 'Courier New', monospace;
}

.countdown-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 4px;
}

.progress-bar {
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #10b981;
  transition: width 0.3s ease;
}

.progress-warning {
  background: #f59e0b;
}

.progress-danger {
  background: #ef4444;
}

.timer-controls {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.control-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.start-btn {
  background: #10b981;
  color: white;
}

.start-btn:hover:not(:disabled) {
  background: #059669;
}

.stop-btn {
  background: #ef4444;
  color: white;
}

.stop-btn:hover:not(:disabled) {
  background: #dc2626;
}

.pause-btn {
  background: #f59e0b;
  color: white;
}

.pause-btn:hover:not(:disabled) {
  background: #d97706;
}

.reset-btn {
  background: #6b7280;
  color: white;
}

.reset-btn:hover:not(:disabled) {
  background: #4b5563;
}

.btn-icon {
  font-size: 1rem;
}

.timer-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
  margin-bottom: 16px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.detail-value {
  font-size: 0.875rem;
  color: #1f2937;
  font-weight: 600;
}

.detail-value.enabled {
  color: #10b981;
}

.detail-value.disabled {
  color: #ef4444;
}

.timer-config {
  border-top: 1px solid #e5e7eb;
  padding-top: 16px;
}

.config-title {
  margin: 0 0 12px 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

.config-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.form-label {
  font-size: 0.875rem;
  color: #374151;
  font-weight: 500;
  min-width: 120px;
}

.form-checkbox {
  width: 20px;
  height: 20px;
  accent-color: #3b82f6;
}

.form-input {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  width: 100px;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .timer-display {
    padding: 16px;
  }
  
  .timer-header {
    flex-direction: column;
    gap: 12px;
  }
  
  .countdown-value {
    font-size: 1.5rem;
  }
  
  .timer-controls {
    justify-content: center;
  }
  
  .detail-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .form-group {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
