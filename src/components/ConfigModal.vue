<template>
  <div class="modal-overlay" v-if="isOpen" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>{{ isEditing ? 'ویرایش کانفیگ' : 'افزودن کانفیگ جدید' }}</h3>
        <button class="close-btn" @click="closeModal">&times;</button>
      </div>

      <form @submit.prevent="handleSubmit" class="config-form">
        <!-- نام کانفیگ -->
        <div class="form-group">
          <label for="config-name">نام کانفیگ *</label>
          <input
            id="config-name"
            type="text"
            v-model="formData.name"
            placeholder="مثال: کانفیگ ایران ۱"
            required
            class="form-input"
          />
        </div>

        <!-- نوع کانفیگ -->
        <div class="form-group">
          <label>نوع کانفیگ *</label>
          <div class="type-selector">
            <button
              type="button"
              class="type-btn"
              :class="{ active: formData.type === 'link' }"
              @click="formData.type = 'link'"
            >
              <span class="type-icon">🔗</span>
              لینک V2Ray
            </button>
            <button
              type="button"
              class="type-btn"
              :class="{ active: formData.type === 'json' }"
              @click="formData.type = 'json'"
            >
              <span class="type-icon">📄</span>
              کانفیگ JSON
            </button>
          </div>
        </div>

        <!-- کشور -->
        <div class="form-group">
          <label for="config-country">کشور / پرچم</label>
          <div class="country-select-wrapper">
            <select
              id="config-country"
              v-model="formData.country"
              class="form-select"
            >
              <option value="">بدون پرچم</option>
              <option v-for="country in countries" :key="country.code" :value="country.code">
                {{ country.name }}
              </option>
            </select>
            <div class="selected-flag" v-if="formData.country">
              <span :class="`fi fi-${formData.country}`"></span>
            </div>
          </div>
        </div>

        <!-- محتوای کانفیگ -->
        <div class="form-group">
          <label for="config-content">
            {{ formData.type === 'link' ? 'لینک V2Ray *' : 'کانفیگ JSON *' }}
          </label>
          <textarea
            id="config-content"
            v-model="formData.content"
            :placeholder="getContentPlaceholder()"
            required
            class="form-textarea"
            :class="{ 'json-mode': formData.type === 'json' }"
            rows="8"
          ></textarea>

          <!-- دکمه فرمت JSON -->
          <button
            v-if="formData.type === 'json'"
            type="button"
            class="format-btn"
            @click="formatJson"
          >
            🎨 فرمت JSON
          </button>
        </div>

        <!-- نمایش خطا -->
        <div class="error-message" v-if="validationError">
          {{ validationError }}
        </div>

        <!-- دکمه‌های عملیات -->
        <div class="form-actions">
          <button type="button" class="cancel-btn" @click="closeModal">
            انصراف
          </button>
          <button type="submit" class="save-btn" :disabled="isSubmitting">
            <span v-if="isSubmitting">در حال ذخیره...</span>
            <span v-else>{{ isEditing ? 'بروزرسانی' : 'ذخیره' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useConfigStore } from '../stores/config'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  editingConfig: {
    type: Object,
    default: null
  },
  category: {
    type: String,
    default: 'main',
    validator: (value) => ['main', 'splash', 'backup'].includes(value)
  }
})

const emit = defineEmits(['close', 'save'])

const countries = [
  { code: 'ir', name: 'Iran' },
  { code: 'de', name: 'Germany' },
  { code: 'us', name: 'United States' },
  { code: 'nl', name: 'Netherlands' },
  { code: 'fr', name: 'France' },
  { code: 'gb', name: 'United Kingdom' },
  { code: 'tr', name: 'Turkey' },
  { code: 'ae', name: 'UAE' },
  { code: 'ru', name: 'Russia' },
  { code: 'fi', name: 'Finland' }
]

const configStore = useConfigStore()
const formData = ref({
  name: '',
  type: 'link',
  content: '',
  country: '',
  category: props.category
})
const validationError = ref('')
const isSubmitting = ref(false)

const isEditing = computed(() => !!props.editingConfig)

// تنظیم داده‌های فرم هنگام باز شدن مودال
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    if (props.editingConfig) {
      formData.value = {
        name: props.editingConfig.name,
        type: props.editingConfig.type,
        content: props.editingConfig.content,
        country: props.editingConfig.country || '',
        category: props.editingConfig.category || props.category
      }
    } else {
      // حالت افزودن جدید
      formData.value = {
        name: '',
        type: 'link',
        content: '',
        country: '',
        category: props.category
      }
    }
    validationError.value = ''
  }
})

const getContentPlaceholder = () => {
  if (formData.value.type === 'link') {
    return 'مثال: vless://uuid@server.com:443?type=tcp&security=tls#Iran-1'
  } else {
    return 'کانفیگ JSON خود را اینجا قرار دهید...'
  }
}

const formatJson = () => {
  try {
    const parsed = JSON.parse(formData.value.content)
    formData.value.content = JSON.stringify(parsed, null, 2)
    validationError.value = ''
  } catch (e) {
    validationError.value = 'فرمت JSON نامعتبر است'
  }
}

const validateForm = () => {
  if (!formData.value.name.trim()) {
    validationError.value = 'نام کانفیگ نمی‌تواند خالی باشد'
    return false
  }

  const validation = configStore.validateV2RayConfig(formData.value.content, formData.value.type)
  if (!validation.isValid) {
    validationError.value = validation.error
    return false
  }

  validationError.value = ''
  return true
}

const handleSubmit = async () => {
  if (!validateForm()) return

  isSubmitting.value = true

  try {
    const configData = {
      name: formData.value.name.trim(),
      type: formData.value.type,
      content: formData.value.content.trim(),
      country: formData.value.country,
      category: formData.value.category
    }

    if (isEditing.value) {
      configStore.updateConfig(props.editingConfig.id, configData)
    } else {
      configStore.addConfig(configData)
    }

    emit('save')
    closeModal()
  } catch (error) {
    console.error('Error saving config:', error)
    validationError.value = 'خطایی در ذخیره کانفیگ رخ داد'
  } finally {
    isSubmitting.value = false
  }
}

const closeModal = () => {
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.3);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px 0;
  margin-bottom: 24px;
}

.modal-header h3 {
  color: #2d3748;
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  font-family: "Vazirmatn", sans-serif;
}

.close-btn {
  background: none;
  border: none;
  font-size: 32px;
  color: #a0aec0;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: all 0.2s ease;
}

.close-btn:hover {
  color: #2d3748;
  transform: scale(1.1);
}

.config-form {
  padding: 0 32px 32px;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  color: #2d3748;
  font-weight: 600;
  font-family: "Vazirmatn", sans-serif;
  margin-bottom: 8px;
  font-size: 14px;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 12px;
  font-size: 16px;
  font-family: "Vazirmatn", sans-serif;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  outline: none;
  resize: vertical;
}

.form-select {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 12px;
  font-size: 16px;
  font-family: "Vazirmatn", sans-serif;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  outline: none;
  cursor: pointer;
  appearance: none; /* Remove default arrow to style wrapper or keep simple */
}

.form-select:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.country-select-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.selected-flag {
  position: absolute;
  left: 16px; /* RTL layout consideration? Or keep it simple */
  top: 50%;
  transform: translateY(-50%);
  font-size: 24px;
  pointer-events: none;
}

/* Adjust select padding if flag is present */
.country-select-wrapper:has( .selected-flag) select {
    padding-left: 50px; 
}

.form-input:focus,
.form-textarea:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-textarea.json-mode {
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.4;
}

.type-selector {
  display: flex;
  gap: 12px;
}

.type-btn {
  flex: 1;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(102, 126, 234, 0.2);
  color: #4a5568;
  padding: 16px 20px;
  border-radius: 12px;
  font-weight: 600;
  font-family: "Vazirmatn", sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.type-btn:hover {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.05);
}

.type-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  color: white;
}

.type-icon {
  font-size: 18px;
}

.format-btn {
  margin-top: 8px;
  background: rgba(251, 146, 60, 0.1);
  border: 1px solid rgba(251, 146, 60, 0.3);
  color: #ea580c;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  font-family: "Vazirmatn", sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
}

.format-btn:hover {
  background: rgba(251, 146, 60, 0.2);
}

.error-message {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #dc2626;
  padding: 12px 16px;
  border-radius: 8px;
  font-family: "Vazirmatn", sans-serif;
  font-size: 14px;
  margin-bottom: 16px;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 32px;
}

.cancel-btn {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(102, 126, 234, 0.2);
  color: #4a5568;
  padding: 14px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-family: "Vazirmatn", sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.05);
}

.save-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  padding: 14px 32px;
  border-radius: 12px;
  font-weight: 600;
  font-family: "Vazirmatn", sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

@media (max-width: 768px) {
  .modal-content {
    margin: 20px;
    max-height: calc(100vh - 40px);
  }

  .modal-header,
  .config-form {
    padding-left: 20px;
    padding-right: 20px;
  }

  .type-selector {
    flex-direction: column;
  }

  .form-actions {
    flex-direction: column;
  }

  .cancel-btn,
  .save-btn {
    width: 100%;
  }
}
</style>
