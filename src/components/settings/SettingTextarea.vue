<template>
  <div class="setting-textarea">
    <label :for="id" class="textarea-label">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>
    <div class="textarea-wrapper">
      <textarea
        :id="id"
        :value="modelValue"
        :placeholder="placeholder"
        :rows="rows"
        :maxlength="maxlength"
        :required="required"
        :disabled="disabled"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur', $event)"
        class="textarea-field"
      ></textarea>
      <div v-if="maxlength" class="char-counter">
        {{ modelValue?.length || 0 }}/{{ maxlength }}
      </div>
    </div>
    <p v-if="description" class="textarea-description">{{ description }}</p>
    <div v-if="error" class="textarea-error">
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
  rows: {
    type: Number,
    default: 4
  },
  maxlength: {
    type: Number,
    default: null
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
    type: String,
    default: ''
  }
})

defineEmits(['update:modelValue', 'blur'])
</script>

<style scoped>
.setting-textarea {
  margin-bottom: 20px;
}

.textarea-label {
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

.textarea-wrapper {
  position: relative;
}

.textarea-field {
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
  resize: vertical;
  line-height: 1.5;
}

.textarea-field:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.textarea-field:disabled {
  background: rgba(243, 244, 246, 0.5);
  color: #9ca3af;
  cursor: not-allowed;
}

.char-counter {
  position: absolute;
  bottom: 8px;
  left: 12px;
  font-size: 11px;
  color: #718096;
  font-family: "Vazirmatn", sans-serif;
  background: rgba(255, 255, 255, 0.9);
  padding: 2px 6px;
  border-radius: 4px;
}

.textarea-description {
  margin: 6px 0 0 0;
  color: #718096;
  font-size: 12px;
  line-height: 1.5;
  font-family: "Vazirmatn", sans-serif;
}

.textarea-error {
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
