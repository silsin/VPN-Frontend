<template>
  <div class="setting-toggle">
    <div class="toggle-content">
      <div class="toggle-info">
        <label class="toggle-label">{{ label }}</label>
        <p v-if="description" class="toggle-description">{{ description }}</p>
      </div>
      <div class="toggle-control">
        <div class="toggle-switch">
          <input
            :id="id"
            type="checkbox"
            :checked="modelValue"
            @change="$emit('update:modelValue', $event.target.checked)"
          />
          <label :for="id" class="toggle-slider"></label>
        </div>
      </div>
    </div>
    <div v-if="warning" class="setting-warning">
      <span class="warning-icon">⚠️</span>
      {{ warning }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  id: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  warning: {
    type: String,
    default: ''
  },
  modelValue: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.setting-toggle {
  padding: 16px 0;
  border-bottom: 1px solid rgba(102, 126, 234, 0.1);
}

.toggle-content {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.toggle-info {
  flex: 1;
}

.toggle-label {
  display: block;
  font-weight: 600;
  color: #2d3748;
  font-family: "Vazirmatn", sans-serif;
  margin-bottom: 4px;
  font-size: 15px;
}

.toggle-description {
  margin: 0;
  color: #718096;
  font-size: 13px;
  line-height: 1.5;
  font-family: "Vazirmatn", sans-serif;
}

.toggle-control {
  flex-shrink: 0;
}

/* Toggle Switch Styles */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

input:checked + .toggle-slider {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

input:checked + .toggle-slider:before {
  transform: translateX(26px);
}

.setting-warning {
  margin-top: 8px;
  padding: 8px 12px;
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #ea580c;
  font-family: "Vazirmatn", sans-serif;
}

.warning-icon {
  font-size: 14px;
}

@media (max-width: 768px) {
  .toggle-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .toggle-control {
    align-self: flex-end;
  }
}
</style>
