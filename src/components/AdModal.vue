<template>
  <div class="modal-overlay" v-if="isOpen" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>{{ isEditing ? 'ویرایش تبلیغ' : 'افزودن تبلیغ جدید' }}</h3>
        <button class="close-btn" @click="closeModal">&times;</button>
      </div>

      <form @submit.prevent="handleSubmit" class="ad-form">
        <!-- نام تبلیغ -->
        <div class="form-group">
          <label for="ad-name">نام تبلیغ *</label>
          <input
            id="ad-name"
            type="text"
            v-model="formData.name"
            placeholder="مثال: بنر صفحه اصلی"
            required
            class="form-input"
          />
        </div>

        <!-- نوع تبلیغ -->
        <div class="form-group">
          <label>نوع تبلیغ *</label>
          <div class="type-selector">
            <button
              type="button"
              class="type-btn"
              :class="{ active: formData.type === 'banner' }"
              @click="formData.type = 'banner'"
            >
              <span class="type-icon">📄</span>
              بنر
            </button>
            <button
              type="button"
              class="type-btn"
              :class="{ active: formData.type === 'video' }"
              @click="formData.type = 'video'"
            >
              <span class="type-icon">🎥</span>
              ویدیو
            </button>
          </div>
        </div>

        <!-- پلتفرم -->
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

        <!-- کلید تبلیغ -->
        <div class="form-group">
          <label for="ad-key">کلید تبلیغ (Ad Unit ID) *</label>
          <input
            id="ad-key"
            type="text"
            v-model="formData.key"
            placeholder="مثال: ca-app-pub-3940256099942544/6300978111"
            required
            class="form-input"
          />
          <small class="form-hint">
            کلید تبلیغ را از Google AdMob یا شبکه تبلیغاتی خود کپی کنید
          </small>
        </div>

        <!-- مکان‌های نمایش تبلیغ -->
        <div class="form-group">
          <label>مکان‌های نمایش تبلیغ *</label>
          <p class="form-hint">انتخاب کنید در کدام بخش‌های اپلیکیشن این تبلیغ نمایش داده شود</p>
          <div class="placements-selector">
            <label class="placement-checkbox">
              <input
                type="checkbox"
                :checked="formData.placements.includes('splash_banner')"
                @change="togglePlacement('splash_banner')"
              />
              <span class="checkmark"></span>
              <div class="placement-info">
                <span class="placement-icon">🏠</span>
                <span class="placement-name">بنر اسپلش</span>
              </div>
            </label>

            <label class="placement-checkbox">
              <input
                type="checkbox"
                :checked="formData.placements.includes('home_banner')"
                @change="togglePlacement('home_banner')"
              />
              <span class="checkmark"></span>
              <div class="placement-info">
                <span class="placement-icon">📱</span>
                <span class="placement-name">بنر صفحه اصلی</span>
              </div>
            </label>

            <label class="placement-checkbox">
              <input
                type="checkbox"
                :checked="formData.placements.includes('video_ads')"
                @change="togglePlacement('video_ads')"
              />
              <span class="checkmark"></span>
              <div class="placement-info">
                <span class="placement-icon">🎬</span>
                <span class="placement-name">تبلیغات ویدیویی</span>
              </div>
            </label>

            <label class="placement-checkbox">
              <input
                type="checkbox"
                :checked="formData.placements.includes('rewarded_video')"
                @change="togglePlacement('rewarded_video')"
              />
              <span class="checkmark"></span>
              <div class="placement-info">
                <span class="placement-icon">🎁</span>
                <span class="placement-name">ویدیو جایزه‌ای</span>
              </div>
            </label>
          </div>
        </div>

        <!-- وضعیت -->
        <div class="form-group">
          <label>وضعیت تبلیغ</label>
          <div class="status-selector">
            <button
              type="button"
              class="status-btn"
              :class="{ active: formData.status === 'active' }"
              @click="formData.status = 'active'"
            >
              <span class="status-icon">✅</span>
              فعال
            </button>
            <button
              type="button"
              class="status-btn"
              :class="{ active: formData.status === 'inactive' }"
              @click="formData.status = 'inactive'"
            >
              <span class="status-icon">🚫</span>
              غیرفعال
            </button>
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
            <span v-else>{{ isEditing ? 'بروزرسانی' : 'ذخیره' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAdsStore } from '../stores/ads'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  editingAd: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

const adsStore = useAdsStore()
const formData = ref({
  name: '',
  type: 'banner',
  platform: 'both',
  key: '',
  placements: [],
  status: 'active'
})
const validationError = ref('')
const isSubmitting = ref(false)

const isEditing = computed(() => !!props.editingAd)

// تنظیم داده‌های فرم هنگام باز شدن مودال
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    if (props.editingAd) {
      formData.value = {
        name: props.editingAd.name,
        type: props.editingAd.type,
        platform: props.editingAd.platform,
        key: props.editingAd.key,
        placements: props.editingAd.placements || [],
        status: props.editingAd.status
      }
    } else {
      // حالت افزودن جدید
      formData.value = {
        name: '',
        type: 'banner',
        platform: 'both',
        key: '',
        placements: [],
        status: 'active'
      }
    }
    validationError.value = ''
  }
})

const togglePlacement = (placement) => {
  const index = formData.value.placements.indexOf(placement)
  if (index > -1) {
    formData.value.placements.splice(index, 1)
  } else {
    formData.value.placements.push(placement)
  }
}

const validateForm = () => {
  if (!formData.value.name.trim()) {
    validationError.value = 'نام تبلیغ نمی‌تواند خالی باشد'
    return false
  }

  if (!formData.value.key.trim()) {
    validationError.value = 'کلید تبلیغ نمی‌تواند خالی باشد'
    return false
  }

  if (!formData.value.placements || formData.value.placements.length === 0) {
    validationError.value = 'حداقل یک مکان نمایش برای تبلیغ انتخاب کنید'
    return false
  }

  // اعتبارسنجی فرمت Ad Unit ID (اختیاری)
  const adUnitIdPattern = /^ca-app-pub-\d+\/\d+$/
  if (!adUnitIdPattern.test(formData.value.key.trim())) {
    validationError.value = 'فرمت کلید تبلیغ نامعتبر است. از فرمت ca-app-pub-XXXX/YYYY استفاده کنید'
    return false
  }

  const validation = adsStore.validateAd({
    ...formData.value,
    name: formData.value.name.trim(),
    key: formData.value.key.trim()
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
    const adData = {
      name: formData.value.name.trim(),
      type: formData.value.type,
      platform: formData.value.platform,
      key: formData.value.key.trim(),
      placements: formData.value.placements,
      status: formData.value.status
    }

    if (isEditing.value) {
      adsStore.updateAd(props.editingAd.id, adData)
    } else {
      adsStore.addAd(adData)
    }

    emit('save')
    closeModal()
  } catch (error) {
    console.error('Error saving ad:', error)
    validationError.value = 'خطایی در ذخیره تبلیغ رخ داد'
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
  max-width: 500px;
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

.ad-form {
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
.platform-selector,
.status-selector {
  display: flex;
  gap: 12px;
}

.type-btn,
.platform-btn,
.status-btn {
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

.type-btn:hover,
.platform-btn:hover,
.status-btn:hover {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.05);
}

.type-btn.active,
.platform-btn.active,
.status-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  color: white;
}

.type-icon,
.platform-icon,
.status-icon {
  font-size: 18px;
}

.placements-selector {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-top: 8px;
}

.placement-checkbox {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.placement-checkbox:hover {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.05);
}

.placement-checkbox input[type="checkbox"] {
  display: none;
}

.checkmark {
  height: 20px;
  width: 20px;
  background-color: #eee;
  border-radius: 4px;
  position: relative;
  flex-shrink: 0;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placement-checkbox input:checked ~ .checkmark {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
  left: 6px;
  top: 2px;
  width: 6px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.placement-checkbox input:checked ~ .checkmark:after {
  display: block;
}

.placement-info {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.placement-info .placement-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.placement-info .placement-name {
  font-weight: 600;
  color: #2d3748;
  font-family: "Vazirmatn", sans-serif;
  font-size: 14px;
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
  .ad-form {
    padding-left: 20px;
    padding-right: 20px;
  }

  .type-selector,
  .platform-selector,
  .status-selector {
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
