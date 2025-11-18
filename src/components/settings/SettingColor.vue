<template>
  <div class="setting-color">
    <label class="color-label">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>
    <div class="color-wrapper">
      <div class="color-preview" :style="{ backgroundColor: modelValue }" @click="openColorPicker">
        <span class="color-value">{{ modelValue }}</span>
      </div>
      <input
        ref="colorInput"
        type="color"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        class="color-input"
      />
      <button type="button" class="color-reset" @click="resetToDefault" title="بازنشانی به پیش‌فرض">
        ↻
      </button>
    </div>
    <div class="color-presets" v-if="presets && presets.length > 0">
      <span class="presets-label">پیش‌فرض‌ها:</span>
      <div class="preset-colors">
        <button
          v-for="preset in presets"
          :key="preset"
          type="button"
          class="preset-color"
          :style="{ backgroundColor: preset }"
          @click="$emit('update:modelValue', preset)"
          :title="preset"
        ></button>
      </div>
    </div>
    <p v-if="description" class="color-description">{{ description }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  defaultColor: {
    type: String,
    default: '#667eea'
  },
  presets: {
    type: Array,
    default: () => []
  },
  modelValue: {
    type: String,
    default: '#667eea'
  }
})

const emit = defineEmits(['update:modelValue'])

const colorInput = ref(null)

const openColorPicker = () => {
  if (colorInput.value) {
    colorInput.value.click()
  }
}

const resetToDefault = () => {
  emit('update:modelValue', props.defaultColor)
}
</script>

<style scoped>
.setting-color {
  margin-bottom: 20px;
}

.color-label {
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

.color-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.color-preview {
  width: 60px;
  height: 40px;
  border-radius: 8px;
  border: 2px solid rgba(102, 126, 234, 0.2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-family: 'Courier New', monospace;
  font-size: 10px;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  font-weight: bold;
}

.color-preview:hover {
  border-color: #667eea;
  transform: scale(1.05);
}

.color-input {
  display: none;
}

.color-reset {
  width: 32px;
  height: 32px;
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.9);
  color: #667eea;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.2s ease;
}

.color-reset:hover {
  background: rgba(102, 126, 234, 0.1);
  border-color: #667eea;
}

.color-presets {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.presets-label {
  font-size: 12px;
  color: #718096;
  font-family: "Vazirmatn", sans-serif;
  white-space: nowrap;
}

.preset-colors {
  display: flex;
  gap: 6px;
}

.preset-color {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.2s ease;
}

.preset-color:hover {
  transform: scale(1.1);
  border-color: rgba(102, 126, 234, 0.3);
}

.color-description {
  margin: 8px 0 0 0;
  color: #718096;
  font-size: 12px;
  line-height: 1.5;
  font-family: "Vazirmatn", sans-serif;
}
</style>
