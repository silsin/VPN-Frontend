<template>
  <div class="setting-select">
    <label :for="id" class="select-label">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>
    <div class="select-wrapper">
      <select
        :id="id"
        :value="modelValue"
        :required="required"
        :disabled="disabled"
        @change="$emit('update:modelValue', $event.target.value)"
        class="select-field"
      >
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
          :disabled="option.disabled"
        >
          {{ option.label }}
        </option>
      </select>
      <div class="select-arrow">▼</div>
    </div>
    <p v-if="description" class="select-description">{{ description }}</p>
    <div v-if="error" class="select-error">
      <span class="error-icon">❌</span>
      {{ error }}
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
  placeholder: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  options: {
    type: Array,
    default: () => []
  },
  modelValue: {
    type: [String, Number],
    default: ''
  }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.setting-select {
  margin-bottom: 20px;
}

.select-label {
  display: block;
  font-weight: 600;
  color: #2d3748;
  font-family: "Vazirmatn", sans-serif;
  margin-bottom: 8px;
  font-size: 14px;
}

.required {
  color: #ef4444;
  margin-right: 4px;
}

.select-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.select-field {
  width: 100%;
  padding: 12px 40px 12px 16px;
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 12px;
  font-size: 14px;
  font-family: "Vazirmatn", sans-serif;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  outline: none;
  appearance: none;
  cursor: pointer;
}

.select-field:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.select-field:disabled {
  background: rgba(243, 244, 246, 0.5);
  color: #9ca3af;
  cursor: not-allowed;
}

.select-arrow {
  position: absolute;
  right: 12px;
  color: #718096;
  font-size: 12px;
  pointer-events: none;
  transition: transform 0.2s ease;
}

.select-field:focus + .select-arrow {
  color: #667eea;
  transform: rotate(180deg);
}

.select-description {
  margin: 6px 0 0 0;
  color: #718096;
  font-size: 12px;
  line-height: 1.5;
  font-family: "Vazirmatn", sans-serif;
}

.select-error {
  margin: 6px 0 0 0;
  padding: 6px 10px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #dc2626;
  font-family: "Vazirmatn", sans-serif;
}

.error-icon {
  font-size: 12px;
}
</style>
