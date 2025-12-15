<template>
  <div class="modal-overlay" v-if="isOpen" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>{{ isEditing ? 'ویرایش دیالوگ/اعلان' : 'افزودن دیالوگ/اعلان جدید' }}</h3>
        <button class="close-btn" @click="closeModal">&times;</button>
      </div>

      <form @submit.prevent="handleSubmit" class="dialog-form">
        <!-- عنوان -->
        <div class="form-group">
          <label for="dialog-title">عنوان *</label>
          <input
            id="dialog-title"
            type="text"
            v-model="formData.title"
            placeholder="عنوان دیالوگ یا اعلان"
            required
            class="form-input"
          />
        </div>

        <!-- پیام -->
        <div class="form-group">
          <label for="dialog-message">پیام *</label>
          <textarea
            id="dialog-message"
            v-model="formData.message"
            placeholder="متن پیام..."
            required
            class="form-textarea"
            rows="4"
          ></textarea>
        </div>

        <!-- نوع (دیالوگ یا Push) -->
        <div class="form-group">
          <label>نوع *</label>
          <div class="type-selector">
            <button
              type="button"
              class="type-btn"
              :class="{ active: formData.type === 'dialog' }"
              @click="setType('dialog')"
            >
              <span class="type-icon">💬</span>
              دیالوگ درون برنامه‌ای
            </button>
            <button
              type="button"
              class="type-btn"
              :class="{ active: formData.type === 'push' }"
              @click="setType('push')"
            >
              <span class="type-icon">🔔</span>
              اعلان Push
            </button>
          </div>
        </div>

        <!-- نوع دیالوگ (فقط برای دیالوگ) -->
        <div class="form-group" v-if="formData.type === 'dialog'">
          <label>نوع دیالوگ *</label>
          <div class="dialog-type-selector">
            <button
              type="button"
              v-for="type in dialogTypes"
              :key="type.value"
              class="dialog-type-btn"
              :class="{ active: formData.dialogType === type.value }"
              @click="formData.dialogType = type.value"
            >
              <span class="type-icon">{{ type.icon }}</span>
              {{ type.label }}
            </button>
          </div>
        </div>

        <!-- دکمه‌های دیالوگ (فقط برای دیالوگ) -->
        <div class="form-group" v-if="formData.type === 'dialog'">
          <label>دکمه‌های دیالوگ</label>
          <div class="action-buttons-config">
            <div
              v-for="(button, index) in formData.buttons"
              :key="index"
              class="action-button-item"
            >
              <input
                type="text"
                v-model="button.label"
                placeholder="متن دکمه (مثلاً دانلود، بستن)"
                required
                class="action-btn-input"
              />
              <input
                type="url"
                v-model="button.actionUrl"
                placeholder="لینک (اختیاری)"
                class="action-btn-input"
              />
              <input
                type="text"
                v-model="button.action"
                placeholder="اکشن (مثلاً dismiss)"
                class="action-btn-input"
              />
              <select
                v-model="button.style"
                class="action-select"
              >
                <option value="primary">اصلی</option>
                <option value="secondary">ثانویه</option>
                <option value="danger">خطر</option>
                <option value="success">موفقیت</option>
              </select>
              <button
                type="button"
                class="remove-btn"
                @click="removeButton(index)"
              >
                ✕
              </button>
            </div>
            <button
              type="button"
              class="add-action-btn"
              @click="addButton"
              :disabled="formData.buttons.length >= 3"
            >
              + افزودن دکمه
            </button>
            <small class="form-hint">حداکثر 3 دکمه توصیه می‌شود. حداقل یکی از لینک یا اکشن باید مقداردهی شود.</small>
          </div>
        </div>

        <!-- تصویر (اختیاری) -->
        <div class="form-group">
          <label for="dialog-image">تصویر (اختیاری)</label>
          <input
            id="dialog-image"
            type="url"
            v-model="formData.imageUrl"
            placeholder="https://example.com/image.jpg"
            class="form-input"
          />
          <small class="form-hint">URL تصویر برای نمایش در دیالوگ یا اعلان</small>
        </div>

        <!-- هدف -->
        <div class="form-group">
          <label>هدف کاربران *</label>
          <div class="target-selector">
            <button
              type="button"
              v-for="target in targets"
              :key="target.value"
              class="target-btn"
              :class="{ active: formData.target === target.value }"
              @click="formData.target = target.value"
            >
              {{ target.label }}
            </button>
          </div>
        </div>

        <!-- اولویت -->
        <div class="form-group">
          <label>اولویت *</label>
          <div class="priority-selector">
            <button
              type="button"
              v-for="priority in priorities"
              :key="priority.value"
              class="priority-btn"
              :class="{ active: formData.priority === priority.value }"
              @click="formData.priority = priority.value"
            >
              {{ priority.label }}
            </button>
          </div>
        </div>

        <!-- زمان‌بندی -->
        <div class="form-group">
          <label>زمان ارسال</label>
          <div class="schedule-options">
            <label class="radio-option">
              <input
                type="radio"
                value="now"
                v-model="scheduleType"
                @change="clearSchedule"
              />
              <span class="radio-label">همین حالا ارسال شود</span>
            </label>
            <label class="radio-option">
              <input
                type="radio"
                value="schedule"
                v-model="scheduleType"
                @change="setScheduleMode"
              />
              <span class="radio-label">برنامه‌ریزی برای زمان مشخص</span>
            </label>
          </div>

          <div v-if="scheduleType === 'schedule'" class="schedule-input">
            <input
              type="datetime-local"
              v-model="formData.scheduleTime"
              class="form-input"
              required
            />
          </div>
        </div>

        <!-- زمان انقضا (اختیاری) -->
        <div class="form-group">
          <label for="dialog-expire-time">زمان انقضا (اختیاری)</label>
          <input
            id="dialog-expire-time"
            type="datetime-local"
            v-model="formData.expireTime"
            class="form-input"
          />
          <small class="form-hint">در صورت تنظیم، دیالوگ/اعلان بعد از این زمان منقضی می‌شود.</small>
        </div>

        <!-- پیش‌نمایش -->
        <div class="form-group">
          <label>پیش‌نمایش</label>
          <div class="preview-container">
            <div v-if="formData.type === 'dialog'" class="dialog-preview">
              <div class="preview-header">پیش‌نمایش دیالوگ</div>
              <div class="dialog-box" :class="formData.dialogType">
                <div v-if="formData.imageUrl" class="dialog-image">
                  <img :src="formData.imageUrl" alt="Dialog image" />
                </div>
                <div class="dialog-content">
                  <h4>{{ formData.title || 'عنوان دیالوگ' }}</h4>
                  <p>{{ formData.message || 'متن پیام دیالوگ...' }}</p>
                  <div class="dialog-actions">
                    <button
                      v-for="(button, index) in formData.buttons"
                      :key="index"
                      class="preview-btn"
                      :class="button.style || 'primary'"
                    >
                      {{ button.label || 'دکمه' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="formData.type === 'push'" class="push-preview">
              <div class="preview-header">پیش‌نمایش اعلان Push</div>
              <div class="push-notification">
                <div v-if="formData.imageUrl" class="push-image">
                  <img :src="formData.imageUrl" alt="Push image" />
                </div>
                <div class="push-content">
                  <div class="push-title">{{ formData.title || 'عنوان اعلان' }}</div>
                  <div class="push-message">{{ formData.message || 'متن اعلان...' }}</div>
                  <div class="push-time">همین حالا</div>
                </div>
              </div>
            </div>
          </div>
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
            <span v-else>{{ isEditing ? 'بروزرسانی' : 'ذخیره پیش‌نویس' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useDialogStore } from '../stores/dialog'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  editingDialog: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

const dialogStore = useDialogStore()
const formData = ref({
  title: '',
  message: '',
  type: 'dialog',
  dialogType: 'info',
  target: 'all',
  priority: 'normal',
  scheduleTime: null,
  expireTime: null,
  imageUrl: '',
  buttons: [{ label: 'متوجه شدم', action: 'dismiss', style: 'primary' }]
})
const scheduleType = ref('now')
const validationError = ref('')
const isSubmitting = ref(false)

const toDateTimeLocalValue = (value) => {
  if (!value) return null
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return null
  const tzOffsetMs = date.getTimezoneOffset() * 60 * 1000
  return new Date(date.getTime() - tzOffsetMs).toISOString().slice(0, 16)
}

const isEditing = computed(() => !!props.editingDialog)

// Computed properties
const dialogTypes = computed(() => dialogStore.dialogTypes)
const targets = computed(() => dialogStore.targets)
const priorities = computed(() => dialogStore.priorities)

// تنظیم داده‌های فرم هنگام باز شدن مودال
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    if (props.editingDialog) {
      formData.value = {
        title: props.editingDialog.title || '',
        message: props.editingDialog.message || '',
        type: props.editingDialog.type || 'dialog',
        dialogType: props.editingDialog.dialogType || 'info',
        target: props.editingDialog.target || 'all',
        priority: props.editingDialog.priority || 'normal',
        scheduleTime: toDateTimeLocalValue(props.editingDialog.scheduleTime) || null,
        expireTime: toDateTimeLocalValue(props.editingDialog.expireTime || props.editingDialog.expiresAt || props.editingDialog.expireAt) || null,
        imageUrl: props.editingDialog.imageUrl || '',
        buttons: props.editingDialog.buttons || [{ label: 'متوجه شدم', action: 'dismiss', style: 'primary' }]
      }
      scheduleType.value = props.editingDialog.scheduleTime ? 'schedule' : 'now'
    } else {
      // حالت افزودن جدید
      formData.value = {
        title: '',
        message: '',
        type: 'dialog',
        dialogType: 'info',
        target: 'all',
        priority: 'normal',
        scheduleTime: null,
        expireTime: null,
        imageUrl: '',
        buttons: [{ label: 'متوجه شدم', action: 'dismiss', style: 'primary' }]
      }
      scheduleType.value = 'now'
    }
    validationError.value = ''
  }
})

const setType = (type) => {
  formData.value.type = type
  if (type === 'push') {
    formData.value.buttons = []
  } else if (formData.value.buttons.length === 0) {
    formData.value.buttons = [{ label: 'متوجه شدم', action: 'dismiss', style: 'primary' }]
  }
}

const addButton = () => {
  if (formData.value.buttons.length < 3) {
    formData.value.buttons.push({ label: '', actionUrl: '', action: '', style: 'primary' })
  }
}

const removeButton = (index) => {
  if (formData.value.buttons.length > 1) {
    formData.value.buttons.splice(index, 1)
  }
}

const clearSchedule = () => {
  formData.value.scheduleTime = null
}

const setScheduleMode = () => {
  if (!formData.value.scheduleTime) {
    // تنظیم زمان پیش‌فرض (۱ ساعت بعد)
    const now = new Date()
    now.setHours(now.getHours() + 1)
    formData.value.scheduleTime = now.toISOString().slice(0, 16)
  }
}

const validateForm = () => {
  if (!formData.value.title.trim()) {
    validationError.value = 'عنوان نمی‌تواند خالی باشد'
    return false
  }

  if (!formData.value.message.trim()) {
    validationError.value = 'پیام نمی‌تواند خالی باشد'
    return false
  }

  if (scheduleType.value === 'schedule' && !formData.value.scheduleTime) {
    validationError.value = 'زمان برنامه‌ریزی را مشخص کنید'
    return false
  }

  if (scheduleType.value === 'schedule') {
    const scheduleDate = new Date(formData.value.scheduleTime)
    const now = new Date()
    if (scheduleDate <= now) {
      validationError.value = 'زمان برنامه‌ریزی باید در آینده باشد'
      return false
    }
  }

  if (formData.value.expireTime) {
    const expireDate = new Date(formData.value.expireTime)
    const now = new Date()
    if (expireDate <= now) {
      validationError.value = 'زمان انقضا باید در آینده باشد'
      return false
    }

    if (scheduleType.value === 'schedule' && formData.value.scheduleTime) {
      const scheduleDate = new Date(formData.value.scheduleTime)
      if (expireDate <= scheduleDate) {
        validationError.value = 'زمان انقضا باید بعد از زمان ارسال باشد'
        return false
      }
    }
  }

  const validation = dialogStore.validateDialog({
    ...formData.value,
    status: 'draft'
  })

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
    // Build payload matching backend DTO (CreateDialogDto/UpdateDialogDto)
    const isDialogType = formData.value.type === 'dialog'
    
    const dialogData = {
      title: formData.value.title.trim(),
      message: formData.value.message.trim(),
      type: isDialogType ? 'in-app' : formData.value.type,
      target: formData.value.target,
      priority: formData.value.priority
    }

    // Only add imageUrl if it's a valid URL
    if (formData.value.imageUrl && formData.value.imageUrl.trim()) {
      const imageUrl = formData.value.imageUrl.trim()
      // Basic URL validation
      if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        dialogData.imageUrl = imageUrl
      }
    }

    // Add buttons array if dialog type (not push)
    if (isDialogType && formData.value.buttons && formData.value.buttons.length > 0) {
      const validButtons = formData.value.buttons
        .filter(btn => btn.label && btn.label.trim())
        .map(btn => {
          const buttonData = {
            label: btn.label.trim()
          }
          
          // Add optional fields only if they have values
          if (btn.actionUrl && btn.actionUrl.trim()) {
            buttonData.actionUrl = btn.actionUrl.trim()
          }
          if (btn.action && btn.action.trim()) {
            buttonData.action = btn.action.trim()
          }
          if (btn.style) {
            buttonData.style = btn.style
          }
          
          return buttonData
        })
      
      // Only add buttons if there are valid ones
      if (validButtons.length > 0) {
        dialogData.buttons = validButtons
      }
    }

    // Only add scheduleTime if scheduling
    if (scheduleType.value === 'schedule' && formData.value.scheduleTime) {
      dialogData.scheduleTime = new Date(formData.value.scheduleTime).toISOString()
    }

    // Only add expireTime if set
    if (formData.value.expireTime) {
      dialogData.expireTime = new Date(formData.value.expireTime).toISOString()
    }

    // Debug: Log the payload being sent
    console.log('📤 Sending dialog data:', JSON.stringify(dialogData, null, 2))

    const result = isEditing.value
      ? await dialogStore.updateDialog(props.editingDialog.id, dialogData)
      : await dialogStore.addDialog(dialogData)

    if (result.success) {
      emit('save')
      closeModal()
    } else {
      validationError.value = result.error || 'خطایی در ذخیره دیالوگ رخ داد'
    }
  } catch (error) {
    console.error('Error saving dialog:', error)
    validationError.value = error.response?.data?.message?.join(', ') || 'خطایی در ذخیره دیالوگ رخ داد'
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
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-x: hidden;
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

.dialog-form {
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

.form-input:focus,
.form-textarea:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-hint {
  display: block;
  color: #718096;
  font-size: 12px;
  margin-top: 6px;
  font-family: "Vazirmatn", sans-serif;
}

.type-selector,
.dialog-type-selector,
.target-selector,
.priority-selector {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.type-btn,
.dialog-type-btn,
.target-btn,
.priority-btn {
  flex: 1;
  min-width: 120px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(102, 126, 234, 0.2);
  color: #4a5568;
  padding: 14px 16px;
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

.type-btn:hover,
.dialog-type-btn:hover,
.target-btn:hover,
.priority-btn:hover {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.05);
}

.type-btn.active,
.dialog-type-btn.active,
.target-btn.active,
.priority-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  color: white;
}

.action-buttons-config {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-button-item {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.action-btn-input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 8px;
  font-family: "Vazirmatn", sans-serif;
}

.action-select {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 8px;
  font-family: "Vazirmatn", sans-serif;
}

.remove-btn {
  background: rgba(239, 68, 68, 0.1);
  border: none;
  color: #dc2626;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
}

.add-action-btn {
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: #16a34a;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-family: "Vazirmatn", sans-serif;
  font-weight: 600;
}

.schedule-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.radio-label {
  font-family: "Vazirmatn", sans-serif;
  color: #4a5568;
}

.schedule-input {
  margin-top: 12px;
}

.preview-container {
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 12px;
  padding: 16px;
  background: rgba(102, 126, 234, 0.02);
}

.preview-header {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 12px;
  font-family: "Vazirmatn", sans-serif;
  font-size: 14px;
}

.dialog-preview .dialog-box {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  max-width: 300px;
}

.dialog-image {
  height: 120px;
  overflow: hidden;
}

.dialog-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.dialog-content {
  padding: 16px;
}

.dialog-content h4 {
  margin: 0 0 8px 0;
  color: #2d3748;
  font-family: "Vazirmatn", sans-serif;
}

.dialog-content p {
  margin: 0 0 16px 0;
  color: #4a5568;
  font-size: 14px;
  line-height: 1.5;
}

.dialog-actions {
  display: flex;
  gap: 8px;
}

.preview-btn {
  flex: 1;
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.3);
  color: #667eea;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: default;
}

.preview-btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  color: white;
}

.preview-btn.secondary {
  background: rgba(148, 163, 184, 0.1);
  border-color: rgba(148, 163, 184, 0.3);
  color: #64748b;
}

.preview-btn.danger {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
  color: #dc2626;
}

.preview-btn.success {
  background: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.3);
  color: #16a34a;
}

.push-preview .push-notification {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 12px;
  padding: 12px;
  max-width: 350px;
}

.push-image {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.push-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.push-content {
  flex: 1;
}

.push-title {
  font-weight: 600;
  color: #2d3748;
  font-size: 14px;
  margin-bottom: 4px;
}

.push-message {
  color: #4a5568;
  font-size: 13px;
  line-height: 1.4;
  margin-bottom: 4px;
}

.push-time {
  color: #718096;
  font-size: 11px;
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
  .modal-overlay {
    padding: 12px;
    align-items: flex-end;
  }

  .modal-content {
    margin: 0;
    max-height: calc(100vh - 24px);
  }

  .modal-header,
  .dialog-form {
    padding-left: 20px;
    padding-right: 20px;
  }

  .modal-header h3 {
    font-size: 18px;
  }

  .type-selector,
  .dialog-type-selector,
  .target-selector,
  .priority-selector {
    flex-direction: column;
  }

  .action-button-item {
    flex-direction: column;
    gap: 6px;
  }

  .action-btn-input,
  .action-select {
    width: 100%;
    min-width: 0;
  }

  .form-actions {
    flex-direction: column;
  }

  .cancel-btn,
  .save-btn {
    width: 100%;
  }

  .dialog-actions {
    flex-direction: column;
  }

  .push-notification {
    flex-direction: column;
    text-align: center;
  }
}
</style>
