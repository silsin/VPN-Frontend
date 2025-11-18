<template>
  <div class="modal-overlay" v-if="isOpen" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>{{ isEditing ? 'ویرایش نسخه' : 'افزودن نسخه جدید' }}</h3>
        <button class="close-btn" @click="closeModal">&times;</button>
      </div>

      <form @submit.prevent="handleSubmit" class="update-form">
        <!-- نام نسخه و کد نسخه -->
        <div class="form-row">
          <div class="form-group">
            <label for="version-name">نام نسخه *</label>
            <input
              id="version-name"
              type="text"
              v-model="formData.versionName"
              placeholder="مثال: 1.2.0"
              required
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="version-code">کد نسخه *</label>
            <input
              id="version-code"
              type="number"
              v-model.number="formData.versionCode"
              placeholder="مثال: 120"
              min="1"
              required
              class="form-input"
            />
            <small class="form-hint">عدد یکتا برای شناسایی نسخه</small>
          </div>
        </div>

        <!-- پلتفرم و نوع آپدیت -->
        <div class="form-row">
          <div class="form-group">
            <label>پلتفرم *</label>
            <div class="platform-selector">
              <button
                type="button"
                class="platform-btn"
                :class="{ active: formData.platform === 'android' }"
                @click="formData.platform = 'android'"
              >
                <span class="platform-icon">🤖</span>
                Android
              </button>
              <button
                type="button"
                class="platform-btn"
                :class="{ active: formData.platform === 'ios' }"
                @click="formData.platform = 'ios'"
              >
                <span class="platform-icon">🍎</span>
                iOS
              </button>
              <button
                type="button"
                class="platform-btn"
                :class="{ active: formData.platform === 'both' }"
                @click="formData.platform = 'both'"
              >
                <span class="platform-icon">📱</span>
                هر دو
              </button>
            </div>
          </div>

          <div class="form-group">
            <label>نوع آپدیت *</label>
            <div class="update-type-selector">
              <button
                type="button"
                class="update-type-btn"
                :class="{ active: formData.updateType === 'normal' }"
                @click="formData.updateType = 'normal'"
              >
                <span class="type-icon">🔄</span>
                معمولی
              </button>
              <button
                type="button"
                class="update-type-btn"
                :class="{ active: formData.updateType === 'force' }"
                @click="formData.updateType = 'force'"
              >
                <span class="type-icon">⚡</span>
                اجباری
              </button>
            </div>
          </div>
        </div>

        <!-- لینک‌های دانلود -->
        <div class="form-row" v-if="formData.platform === 'android' || formData.platform === 'both'">
          <div class="form-group full-width">
            <label for="download-url">لینک دانلود Android *</label>
            <input
              id="download-url"
              type="url"
              v-model="formData.downloadUrl"
              placeholder="https://play.google.com/store/apps/details?id=..."
              required
              class="form-input"
            />
          </div>
        </div>

        <div class="form-row" v-if="formData.platform === 'ios' || formData.platform === 'both'">
          <div class="form-group full-width">
            <label for="ios-url">لینک دانلود iOS *</label>
            <input
              id="ios-url"
              type="url"
              v-model="formData.iosUrl"
              placeholder="https://apps.apple.com/app/..."
              required
              class="form-input"
            />
          </div>
        </div>

        <!-- حداقل نسخه پشتیبانی شده -->
        <div class="form-row">
          <div class="form-group">
            <label for="min-version">حداقل نسخه پشتیبانی شده</label>
            <input
              id="min-version"
              type="text"
              v-model="formData.minSupportedVersion"
              placeholder="مثال: 1.0.0"
              class="form-input"
            />
            <small class="form-hint">کاربران با نسخه‌های پایین‌تر مجبور به آپدیت می‌شوند</small>
          </div>

          <div class="form-group">
            <label>وضعیت انتشار</label>
            <div class="status-selector">
              <button
                type="button"
                class="status-btn"
                :class="{ active: formData.status === 'active' }"
                @click="formData.status = 'active'"
              >
                <span class="status-icon">🚀</span>
                انتشار فوری
              </button>
              <button
                type="button"
                class="status-btn"
                :class="{ active: formData.status === 'inactive' }"
                @click="formData.status = 'inactive'"
              >
                <span class="status-icon">📦</span>
                پیش‌نویس
              </button>
            </div>
          </div>
        </div>

        <!-- نکات انتشار -->
        <div class="form-group full-width">
          <label>نکات انتشار *</label>
          <div class="release-notes-editor">
            <div
              v-for="(note, index) in formData.releaseNotes"
              :key="index"
              class="note-item"
            >
              <input
                type="text"
                v-model="formData.releaseNotes[index]"
                placeholder="تغییر یا ویژگی جدید..."
                class="note-input"
              />
              <button
                type="button"
                class="remove-note-btn"
                @click="removeReleaseNote(index)"
                v-if="formData.releaseNotes.length > 1"
              >
                ✕
              </button>
            </div>
            <button
              type="button"
              class="add-note-btn"
              @click="addReleaseNote"
            >
              + افزودن نکته انتشار
            </button>
          </div>
        </div>

        <!-- پیش‌نمایش دیالوگ آپدیت -->
        <div class="form-group full-width">
          <label>پیش‌نمایش دیالوگ آپدیت</label>
          <div class="dialog-preview">
            <div class="preview-header">نمایش در اپلیکیشن</div>
            <div class="update-dialog-box" :class="formData.updateType">
              <div class="dialog-header">
                <h4>{{ formData.updateType === 'force' ? 'بروزرسانی اجباری' : 'نسخه جدید FlyVPN' }}</h4>
              </div>
              <div class="dialog-content">
                <p>{{ formData.updateType === 'force'
                  ? 'برای ادامه استفاده از اپلیکیشن، باید به آخرین نسخه بروزرسانی کنید.'
                  : 'نسخه جدید اپلیکیشن FlyVPN منتشر شده است. برای تجربه بهترین عملکرد، همین حالا بروزرسانی کنید.' }}</p>

                <div class="version-info">
                  <strong>نسخه {{ formData.versionName }}</strong>
                </div>

                <div class="release-highlights">
                  <div v-for="note in formData.releaseNotes.slice(0, 3)" :key="note" class="highlight-item">
                    • {{ note }}
                  </div>
                  <div v-if="formData.releaseNotes.length > 3" class="more-highlights">
                    و {{ formData.releaseNotes.length - 3 }} تغییر دیگر...
                  </div>
                </div>
              </div>
              <div class="dialog-actions">
                <button class="preview-btn secondary" v-if="formData.updateType !== 'force'">
                  بعداً
                </button>
                <button class="preview-btn primary">
                  بروزرسانی
                </button>
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
            <span v-else>{{ isEditing ? 'بروزرسانی' : 'ذخیره نسخه' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useUpdateStore } from '../stores/update'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  editingUpdate: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

const updateStore = useUpdateStore()
const formData = ref({
  versionName: '',
  versionCode: 0,
  platform: 'both',
  updateType: 'normal',
  status: 'inactive',
  downloadUrl: '',
  iosUrl: '',
  minSupportedVersion: '1.0.0',
  releaseNotes: ['']
})
const validationError = ref('')
const isSubmitting = ref(false)

const isEditing = computed(() => !!props.editingUpdate)

// Computed properties
const platforms = computed(() => updateStore.platforms)
const updateTypes = computed(() => updateStore.updateTypes)

// تنظیم داده‌های فرم هنگام باز شدن مودال
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    if (props.editingUpdate) {
      formData.value = {
        versionName: props.editingUpdate.versionName || '',
        versionCode: props.editingUpdate.versionCode || 0,
        platform: props.editingUpdate.platform || 'both',
        updateType: props.editingUpdate.updateType || 'normal',
        status: props.editingUpdate.status || 'inactive',
        downloadUrl: props.editingUpdate.downloadUrl || '',
        iosUrl: props.editingUpdate.iosUrl || '',
        minSupportedVersion: props.editingUpdate.minSupportedVersion || '1.0.0',
        releaseNotes: props.editingUpdate.releaseNotes ? [...props.editingUpdate.releaseNotes] : ['']
      }
    } else {
      // حالت افزودن جدید
      formData.value = {
        versionName: '',
        versionCode: Math.max(...updateStore.updates.map(u => u.versionCode), 0) + 1,
        platform: 'both',
        updateType: 'normal',
        status: 'inactive',
        downloadUrl: '',
        iosUrl: '',
        minSupportedVersion: '1.0.0',
        releaseNotes: ['']
      }
    }
    validationError.value = ''
  }
})

const addReleaseNote = () => {
  formData.value.releaseNotes.push('')
}

const removeReleaseNote = (index) => {
  if (formData.value.releaseNotes.length > 1) {
    formData.value.releaseNotes.splice(index, 1)
  }
}

const validateForm = () => {
  if (!formData.value.versionName.trim()) {
    validationError.value = 'نام نسخه نمی‌تواند خالی باشد'
    return false
  }

  if (!formData.value.versionCode || formData.value.versionCode < 1) {
    validationError.value = 'کد نسخه باید عدد مثبت باشد'
    return false
  }

  if (!formData.value.releaseNotes || formData.value.releaseNotes.filter(note => note.trim()).length === 0) {
    validationError.value = 'حداقل یک نکته انتشار اضافه کنید'
    return false
  }

  if ((formData.value.platform === 'android' || formData.value.platform === 'both') &&
      (!formData.value.downloadUrl || !formData.value.downloadUrl.trim())) {
    validationError.value = 'لینک دانلود Android نمی‌تواند خالی باشد'
    return false
  }

  if ((formData.value.platform === 'ios' || formData.value.platform === 'both') &&
      (!formData.value.iosUrl || !formData.value.iosUrl.trim())) {
    validationError.value = 'لینک دانلود iOS نمی‌تواند خالی باشد'
    return false
  }

  const validation = updateStore.validateUpdate({
    ...formData.value,
    id: props.editingUpdate?.id || null
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
    const updateData = {
      ...formData.value,
      releaseNotes: formData.value.releaseNotes.filter(note => note.trim())
    }

    if (isEditing.value) {
      updateStore.updateUpdate(props.editingUpdate.id, updateData)
    } else {
      updateStore.addUpdate(updateData)
    }

    emit('save')
    closeModal()
  } catch (error) {
    console.error('Error saving update:', error)
    validationError.value = 'خطایی در ذخیره نسخه رخ داد'
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
  max-width: 800px;
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

.update-form {
  padding: 0 32px 32px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  color: #2d3748;
  font-weight: 600;
  font-family: "Vazirmatn", sans-serif;
  margin-bottom: 8px;
  font-size: 14px;
}

.form-input {
  padding: 12px 16px;
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 12px;
  font-size: 16px;
  font-family: "Vazirmatn", sans-serif;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  outline: none;
}

.form-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-hint {
  color: #718096;
  font-size: 12px;
  margin-top: 6px;
  font-family: "Vazirmatn", sans-serif;
}

.platform-selector,
.update-type-selector,
.status-selector {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.platform-btn,
.update-type-btn,
.status-btn {
  flex: 1;
  min-width: 100px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(102, 126, 234, 0.2);
  color: #4a5568;
  padding: 12px 16px;
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

.platform-btn:hover,
.update-type-btn:hover,
.status-btn:hover {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.05);
}

.platform-btn.active,
.update-type-btn.active,
.status-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  color: white;
}

.platform-icon,
.type-icon,
.status-icon {
  font-size: 16px;
}

.release-notes-editor {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.note-item {
  display: flex;
  gap: 8px;
  align-items: center;
}

.note-input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 8px;
  font-family: "Vazirmatn", sans-serif;
  font-size: 14px;
}

.remove-note-btn {
  background: rgba(239, 68, 68, 0.1);
  border: none;
  color: #dc2626;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  flex-shrink: 0;
}

.add-note-btn {
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: #16a34a;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-family: "Vazirmatn", sans-serif;
  font-weight: 600;
  align-self: flex-start;
}

.dialog-preview {
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

.update-dialog-box {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  max-width: 300px;
  margin: 0 auto;
}

.update-dialog-box.force {
  border-top: 4px solid #ef4444;
}

.update-dialog-box .dialog-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px;
  text-align: center;
}

.update-dialog-box.force .dialog-header {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.dialog-header h4 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  font-family: "Vazirmatn", sans-serif;
}

.dialog-content {
  padding: 16px;
}

.dialog-content p {
  margin: 0 0 12px 0;
  color: #4a5568;
  font-size: 14px;
  line-height: 1.5;
  text-align: center;
}

.version-info {
  text-align: center;
  margin-bottom: 12px;
  color: #2d3748;
  font-size: 14px;
}

.release-highlights {
  margin-bottom: 16px;
}

.highlight-item {
  font-size: 13px;
  color: #4a5568;
  margin-bottom: 4px;
  line-height: 1.4;
}

.more-highlights {
  font-size: 12px;
  color: #718096;
  font-style: italic;
  margin-top: 4px;
}

.dialog-actions {
  display: flex;
  gap: 8px;
  padding: 0 16px 16px;
}

.preview-btn {
  flex: 1;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-family: "Vazirmatn", sans-serif;
  font-size: 14px;
  cursor: default;
  border: none;
}

.preview-btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.preview-btn.secondary {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
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
  .update-form {
    padding-left: 20px;
    padding-right: 20px;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .platform-selector,
  .update-type-selector,
  .status-selector {
    flex-direction: column;
  }

  .platform-btn,
  .update-type-btn,
  .status-btn {
    min-width: auto;
  }

  .note-item {
    flex-direction: column;
    gap: 6px;
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
