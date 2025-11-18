<template>
  <div class="setting-input">
    <label :for="id" class="input-label">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>
    <div class="input-wrapper">
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :min="min"
        :max="max"
        :step="step"
        :required="required"
        :disabled="disabled"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur', $event)"
        class="input-field"
        :class="{ 'has-icon': icon || unit }"
      />
      <span v-if="icon" class="input-icon">{{ icon }}</span>
      <span v-if="unit" class="input-unit">{{ unit }}</span>
    </div>
    <p v-if="description" class="input-description">{{ description }}</p>
    <div v-if="error" class="input-error">
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
  type: {
    type: String,
    default: 'text'
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
  icon: {
    type: String,
    default: ''
  },
  unit: {
    type: String,
    default: ''
  },
  min: {
    type: [Number, String],
    default: undefined
  },
  max: {
    type: [Number, String],
    default: undefined
  },
  step: {
    type: [Number, String],
    default: undefined
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: [String, Number],
    default: ''
  }
})

defineEmits(['update:modelValue', 'blur'])
</script>

<style scoped>
.setting-input {
  margin-bottom: 20px;
}

.input-label {
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

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-field {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 12px;
  font-size: 14px;
  font-family: "Vazirmatn", sans-serif;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  outline: none;
}

.input-field:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.input-field.has-icon {
  padding-right: 40px;
}

.input-field:disabled {
  background: rgba(243, 244, 246, 0.5);
  color: #9ca3af;
  cursor: not-allowed;
}

.input-icon,
.input-unit {
  position: absolute;
  right: 12px;
  color: #718096;
  font-size: 14px;
  pointer-events: none;
}

.input-description {
  margin: 6px 0 0 0;
  color: #718096;
  font-size: 12px;
  line-height: 1.5;
  font-family: "Vazirmatn", sans-serif;
}

.input-error {
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
