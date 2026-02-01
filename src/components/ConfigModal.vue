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
              V2Ray
            </button>
            <button
              type="button"
              class="type-btn"
              :class="{ active: formData.type === 'openvpn' }"
              @click="formData.type = 'openvpn'"
            >
              <span class="type-icon">🛡️</span>
              OpenVPN
            </button>
            <button
              type="button"
              class="type-btn"
              :class="{ active: formData.type === 'sstp' }"
              @click="formData.type = 'sstp'"
            >
              <span class="type-icon">🔒</span>
              SSTP
            </button>
            <button
              type="button"
              class="type-btn"
              :class="{ active: formData.type === 'ssh' }"
              @click="formData.type = 'ssh'"
            >
              <span class="type-icon">⌨️</span>
              SSH
            </button>
            <button
              type="button"
              class="type-btn"
              :class="{ active: formData.type === 'json' }"
              @click="formData.type = 'json'"
            >
              <span class="type-icon">📄</span>
              JSON
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

        <!-- محتوای اختصاصی پروتکل‌ها -->
        <!-- OpenVPN File Upload -->
        <div class="form-group" v-if="formData.type === 'openvpn'">
          <label>آپلود فایل .ovpn</label>
          <div class="file-upload-wrapper">
            <input
              type="file"
              accept=".ovpn"
              @change="handleFileUpload"
              class="file-input"
              id="ovpn-file"
            />
            <label for="ovpn-file" class="file-label">
              <span class="file-icon">📁</span>
              {{ uploadedFileName || 'انتخاب فایل .ovpn' }}
            </label>
          </div>
        </div>

        <!-- SSH Fields -->
        <div v-if="formData.type === 'ssh'" class="protocol-fields">
          <div class="form-row">
            <div class="form-group flex-2">
              <label>آدرس سرور (IP/Host) *</label>
              <input type="text" v-model="protocolData.ssh.host" placeholder="مثال: 1.2.3.4" class="form-input" />
            </div>
            <div class="form-group flex-1">
              <label>پورت *</label>
              <input type="number" v-model="protocolData.ssh.port" placeholder="22" class="form-input" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>نام کاربری *</label>
              <input type="text" v-model="protocolData.ssh.username" placeholder="root" class="form-input" />
            </div>
            <div class="form-group">
              <label>رمز عبور</label>
              <input type="password" v-model="protocolData.ssh.password" placeholder="••••••••" class="form-input" />
            </div>
          </div>
          <div class="form-group">
            <label>کلید خصوصی (Private Key - اختیاری)</label>
            <textarea v-model="protocolData.ssh.privateKey" placeholder="-----BEGIN RSA PRIVATE KEY-----" class="form-textarea" rows="4"></textarea>
          </div>
        </div>

        <!-- SSTP Fields -->
        <div v-if="formData.type === 'sstp'" class="protocol-fields">
          <div class="form-group">
            <label>آدرس سرور SSTP *</label>
            <input type="text" v-model="protocolData.sstp.server" placeholder="s1.example.com" class="form-input" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>نام کاربری *</label>
              <input type="text" v-model="protocolData.sstp.username" class="form-input" />
            </div>
            <div class="form-group">
              <label>رمز عبور *</label>
              <input type="password" v-model="protocolData.sstp.password" class="form-input" />
            </div>
          </div>
        </div>

        <!-- محتوای اصلی (متنی) -->
        <div class="form-group" v-if="['link', 'json', 'openvpn'].includes(formData.type)">
          <label for="config-content">
            {{ getContentLabel() }} *
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
const uploadedFileName = ref('')

const protocolData = ref({
  ssh: { host: '', port: '22', username: '', password: '', privateKey: '' },
  sstp: { server: '', username: '', password: '' }
})

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
    uploadedFileName.value = ''
    resetProtocolData()
    
    if (props.editingConfig) {
      formData.value = {
        name: props.editingConfig.name,
        type: props.editingConfig.type,
        content: props.editingConfig.content,
        country: props.editingConfig.country || '',
        category: props.editingConfig.category || props.category
      }

      // اگر محتوا JSON بود (برای SSH/SSTP)، آن را پارس کن
      if (['ssh', 'sstp'].includes(props.editingConfig.type)) {
        try {
          const parsed = JSON.parse(props.editingConfig.content)
          protocolData.value[props.editingConfig.type] = { ...protocolData.value[props.editingConfig.type], ...parsed }
        } catch (e) {
          console.error('Error parsing protocol data:', e)
        }
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

const resetProtocolData = () => {
  protocolData.value = {
    ssh: { host: '', port: '22', username: '', password: '', privateKey: '' },
    sstp: { server: '', username: '', password: '' }
  }
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  uploadedFileName.value = file.name
  const reader = new FileReader()
  reader.onload = (e) => {
    formData.value.content = e.target.result
  }
  reader.readAsText(file)
}

const getContentLabel = () => {
  const labels = {
    link: 'لینک V2Ray',
    json: 'کانفیگ JSON',
    openvpn: 'فایل/محتوای OpenVPN',
    sstp: 'آدرس/اطلاعات SSTP',
    ssh: 'اطلاعات اتصال SSH'
  }
  return labels[formData.value.type] || 'محتوای کانفیگ'
}

const getContentPlaceholder = () => {
  if (formData.value.type === 'link') {
    return 'مثال: vless://uuid@server.com:443?type=tcp&security=tls#Iran-1'
  } else if (formData.value.type === 'json') {
    return 'کانفیگ JSON خود را اینجا قرار دهید...'
  } else if (formData.value.type === 'openvpn') {
    return 'محتوای فایل .ovpn را اینجا کپی کنید...'
  } else if (formData.value.type === 'sstp') {
    return 'آدرس سرور یا اطلاعات اتصال SSTP...'
  } else if (formData.value.type === 'ssh') {
    return 'سرور:پورت یا دستور اتصال SSH...'
  }
  return 'محتوا را اینجا وارد کنید...'
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

  // اعتبارسنجی اختصاصی براساس نوع
  if (formData.value.type === 'ssh') {
    const { host, port, username } = protocolData.value.ssh
    if (!host || !port || !username) {
      validationError.value = 'لطفاً فیلدهای اجباری SSH را پر کنید'
      return false
    }
  } else if (formData.value.type === 'sstp') {
    const { server, username, password } = protocolData.value.sstp
    if (!server || !username || !password) {
      validationError.value = 'لطفاً فیلدهای اجباری SSTP را پر کنید'
      return false
    }
  } else {
    // V2Ray & OpenVPN validation
    const validation = configStore.validateV2RayConfig(formData.value.content, formData.value.type)
    if (!validation.isValid) {
      validationError.value = validation.error
      return false
    }
  }

  validationError.value = ''
  return true
}

const handleSubmit = async () => {
  if (!validateForm()) return

  isSubmitting.value = true

  try {
    let finalContent = formData.value.content.trim()

    // اگر پروتکل ساختاریافته بود، آن را به JSON تبدیل کن
    if (['ssh', 'sstp'].includes(formData.value.type)) {
      finalContent = JSON.stringify(protocolData.value[formData.value.type])
    }

    const configData = {
      name: formData.value.name.trim(),
      type: formData.value.type,
      content: finalContent,
      country: formData.value.country,
      category: formData.value.category
    }

    if (isEditing.value) {
      await configStore.updateConfig(props.editingConfig.id, configData)
    } else {
      await configStore.addConfig(configData)
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
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(25px) saturate(180%);
  border-radius: 32px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  max-width: 650px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  animation: modalIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modalIn {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32px 40px 10px;
  margin-bottom: 24px;
}

.modal-header h3 {
  color: #ffffff;
  font-size: 26px;
  font-weight: 800;
  margin: 0;
  font-family: "Vazirmatn", sans-serif;
  background: linear-gradient(135deg, #818cf8 0%, #c084fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.close-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 24px;
  color: #94a3b8;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 12px;
  line-height: 1;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  transform: rotate(90deg);
}

.config-form {
  padding: 0 40px 40px;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  color: #cbd5e1;
  font-weight: 600;
  font-family: "Vazirmatn", sans-serif;
  margin-bottom: 10px;
  font-size: 14px;
  margin-right: 4px;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 16px 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  font-size: 16px;
  font-family: "Vazirmatn", sans-serif;
  background: rgba(0, 0, 0, 0.2);
  color: #ffffff;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  border-color: #818cf8;
  background: rgba(0, 0, 0, 0.3);
  box-shadow: 0 0 0 4px rgba(129, 140, 248, 0.1);
}

.type-selector {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 10px;
}

.type-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  padding: 12px 8px;
  border-radius: 16px;
  font-weight: 600;
  font-size: 13px;
  font-family: "Vazirmatn", sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.type-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.type-btn.active {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%);
  border-color: #818cf8;
  color: #ffffff;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.protocol-fields {
  background: rgba(129, 140, 248, 0.05);
  padding: 24px;
  border-radius: 20px;
  border: 1px solid rgba(129, 140, 248, 0.1);
  margin-bottom: 24px;
}

.form-actions {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  margin-top: 40px;
}

.cancel-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  padding: 16px 32px;
  border-radius: 16px;
  font-weight: 600;
  font-family: "Vazirmatn", sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.save-btn {
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  border: none;
  color: white;
  padding: 16px 48px;
  border-radius: 16px;
  font-weight: 700;
  font-family: "Vazirmatn", sans-serif;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3);
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-4px);
  box-shadow: 0 15px 30px rgba(99, 102, 241, 0.4);
  filter: brightness(1.1);
}

.save-btn:disabled {
  background: #334155;
  cursor: not-allowed;
  opacity: 0.5;
  box-shadow: none;
}

.file-label {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  background: rgba(0, 0, 0, 0.2);
  border: 2px dashed rgba(129, 140, 248, 0.3);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #e2e8f0;
}

.file-label:hover {
  border-color: #818cf8;
  background: rgba(129, 140, 248, 0.1);
}

@media (max-width: 768px) {
  .config-form { padding: 0 24px 32px; }
  .modal-header { padding: 24px 24px 10px; }
  .form-actions { flex-direction: column-reverse; }
  .cancel-btn, .save-btn { width: 100%; }
}
</style>
