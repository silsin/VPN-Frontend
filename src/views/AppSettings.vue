<template>
  <DashboardLayout>
    <div class="page-content">
      <h1 class="page-title">تنظیمات برنامه</h1>
      <p class="page-description">مدیریت تنظیمات کلی و پیکربندی اپلیکیشن VPN.</p>

      <SettingsTabs
        :categories="settingsCategories"
        :initial-tab="'general'"
        @export-settings="exportSettings"
        @import-settings="importSettings"
        @reset-settings="resetSettings"
        @save-category="saveCategorySettings"
      >
        <template #default="{ category, settings }">
          <!-- تنظیمات عمومی -->
          <template v-if="category === 'general'">
            <SettingInput
              id="app-name"
              label="نام اپلیکیشن"
              v-model="settings.appName"
              placeholder="FlyVPN"
              description="نام نمایشی اپلیکیشن در فروشگاه‌ها"
              required
            />

            <SettingTextarea
              id="app-description"
              label="توضیحات اپلیکیشن"
              v-model="settings.appDescription"
              placeholder="توضیحات اپلیکیشن..."
              rows="3"
              description="توضیحات کوتاه درباره اپلیکیشن"
            />

            <SettingInput
              id="app-version"
              label="نسخه اپلیکیشن"
              v-model="settings.appVersion"
              placeholder="1.2.0"
              description="نسخه فعلی اپلیکیشن"
            />

            <SettingInput
              id="package-name"
              label="شناسه بسته (Package Name)"
              v-model="settings.packageName"
              placeholder="com.flyvpn.app"
              description="شناسه یکتا اپلیکیشن"
            />

            <SettingInput
              id="developer-name"
              label="نام توسعه‌دهنده"
              v-model="settings.developerName"
              placeholder="FlyVPN Team"
              description="نام توسعه‌دهنده یا شرکت"
            />

            <SettingInput
              id="support-email"
              label="ایمیل پشتیبانی"
              type="email"
              v-model="settings.supportEmail"
              placeholder="support@flyvpn.com"
              description="ایمیل تماس برای پشتیبانی"
            />

            <SettingInput
              id="privacy-url"
              label="لینک حریم خصوصی"
              type="url"
              v-model="settings.privacyPolicyUrl"
              placeholder="https://flyvpn.com/privacy"
              description="لینک به سیاست حفظ حریم خصوصی"
            />

            <SettingInput
              id="terms-url"
              label="لینک شرایط استفاده"
              type="url"
              v-model="settings.termsOfServiceUrl"
              placeholder="https://flyvpn.com/terms"
              description="لینک به شرایط استفاده از اپلیکیشن"
            />
          </template>

          <!-- تنظیمات اعلان‌ها -->
          <template v-if="category === 'notifications'">
            <SettingToggle
              id="enable-push"
              label="اعلان‌های Push"
              v-model="settings.enablePushNotifications"
              description="ارسال اعلان‌های Push به دستگاه کاربر"
            />

            <SettingToggle
              id="enable-sound"
              label="صدا اعلان‌ها"
              v-model="settings.enableSound"
              description="پخش صدا هنگام دریافت اعلان"
            />

            <SettingToggle
              id="enable-vibration"
              label="لرزش اعلان‌ها"
              v-model="settings.enableVibration"
              description="لرزش دستگاه هنگام دریافت اعلان"
            />

            <SettingToggle
              id="enable-badge"
              label="نشان اعلان‌ها"
              v-model="settings.enableBadge"
              description="نمایش نشان اعلان روی آیکون اپلیکیشن"
            />

            <SettingSelect
              v-if="settings.enableSound"
              id="notification-sound"
              label="صدا اعلان"
              v-model="settings.notificationSound"
              :options="[
                { value: 'default', label: 'پیش‌فرض سیستم' },
                { value: 'custom1', label: 'اعلان ۱' },
                { value: 'custom2', label: 'اعلان ۲' }
              ]"
              description="صدا برای اعلان‌ها"
            />

            <SettingInput
              id="max-notifications"
              label="حداکثر اعلان در روز"
              type="number"
              v-model.number="settings.maxNotificationsPerDay"
              :min="1"
              :max="50"
              placeholder="10"
              description="حداکثر تعداد اعلان‌های روزانه"
            />

            <SettingToggle
              id="enable-marketing"
              label="اعلان‌های بازاریابی"
              v-model="settings.enableMarketingNotifications"
              description="ارسال اعلان‌های تبلیغاتی و بازاریابی"
            />

            <SettingToggle
              id="enable-system"
              label="اعلان‌های سیستمی"
              v-model="settings.enableSystemNotifications"
              description="اعلان‌های مربوط به عملکرد اپلیکیشن"
            />

            <SettingToggle
              id="enable-update"
              label="اعلان‌های بروزرسانی"
              v-model="settings.enableUpdateNotifications"
              description="اعلان‌های مربوط به بروزرسانی اپلیکیشن"
            />
          </template>

          <!-- تنظیمات سرور -->
          <template v-if="category === 'server'">
            <SettingToggle
              id="force-server-selection"
              label="اجبار به انتخاب خودکار سرور"
              v-model="settings.forceServerSelection"
              description="اپلیکیشن به صورت خودکار سرور مناسب را انتخاب می‌کند"
            />

            <SettingToggle
              id="enable-server-dialog"
              label="دیالوگ انتخاب سرور"
              v-model="settings.enableServerDialog"
              description="نمایش دیالوگ برای انتخاب سرور هنگام اتصال"
            />
          </template>

          <!-- تنظیمات تایمرها -->
          <template v-if="category === 'timers'">
            <div class="settings-section">
              <h3>تایمرهای اتصال</h3>
              
              <SettingInput
                id="auto-disconnect-timer"
                label="تایمر قطع خودکار (دقیقه)"
                type="number"
                v-model.number="settings.autoDisconnectTimer"
                :min="1"
                :max="60"
                placeholder="30"
                description="مدت زمان تا قطع خودکار اتصال VPN"
              />

              <SettingInput
                id="connection-timeout"
                label="تایم‌اوت اتصال (ثانیه)"
                type="number"
                v-model.number="settings.connectionTimeout"
                :min="5"
                :max="60"
                placeholder="15"
                description="حداکثر زمان انتظار برای برقراری اتصال"
              />

              <SettingInput
                id="status-polling-interval"
                label="فاصله بررسی وضعیت (ثانیه)"
                type="number"
                v-model.number="settings.statusPollingInterval"
                :min="1"
                :max="10"
                placeholder="3"
                description="فاصله زمانی بررسی وضعیت اتصال"
              />
            </div>

            <div class="settings-section">
              <h3>تایمرهای آمار</h3>
              
              <SettingToggle
                id="enable-vpn-statistics"
                label="جمع‌آوری آمار VPN"
                v-model="settings.enableVpnStatistics"
                description="جمع‌آوری آمار مصرف و عملکرد VPN"
              />

              <SettingInput
                v-if="settings.enableVpnStatistics"
                id="statistics-update-interval"
                label="فاصله به‌روزرسانی آمار (ثانیه)"
                type="number"
                v-model.number="settings.statisticsUpdateInterval"
                :min="5"
                :max="30"
                placeholder="5"
                description="فاصله زمانی به‌روزرسانی آمار"
              />

              <SettingToggle
                id="enable-protocol-statistics"
                label="آمار پروتکل‌ها"
                v-model="settings.enableProtocolStatistics"
                description="جمع‌آوری آمار پروتکل‌های مختلف VPN"
              />

              <SettingToggle
                id="enable-ikev2-statistics"
                label="آمار IKEv2"
                v-model="settings.enableIkev2Statistics"
                description="جمع‌آوری آمار اختصاصی پروتکل IKEv2"
              />
            </div>

            <div class="settings-section">
              <h3>تایمرهای عملکرد</h3>
              
              <SettingInput
                id="debounce-delay"
                label="تأخیر Debounce (میلی‌ثانیه)"
                type="number"
                v-model.number="settings.debounceDelay"
                :min="100"
                :max="1000"
                :step="100"
                placeholder="300"
                description="تأخیر برای جلوگیری از اجرای مکرر عملیات"
              />

              <SettingInput
                id="background-ping-interval"
                label="فاصله Ping پس‌زمینه (ثانیه)"
                type="number"
                v-model.number="settings.backgroundPingInterval"
                :min="30"
                :max="300"
                placeholder="60"
                description="فاصله زمانی بررسی پینگ سرورها"
              />

              <SettingInput
                id="server-selection-delay"
                label="تأخیر انتخاب سرور (ثانیه)"
                type="number"
                v-model.number="settings.serverSelectionDelay"
                :min="1"
                :max="10"
                placeholder="3"
                description="تأخیر قبل از انتخاب خودکار سرور"
              />
            </div>

            <div class="settings-section">
              <h3>تایمرهای کاربر</h3>
              
              <SettingToggle
                id="enable-session-timer"
                label="تایمر نشست کاربر"
                v-model="settings.enableSessionTimer"
                description="ثبت مدت زمان استفاده کاربر از VPN"
              />

              <SettingToggle
                id="enable-connection-tracking"
                label="ردیابی اتصال"
                v-model="settings.enableConnectionTracking"
                description="ردیابی تاریخچه اتصال‌های کاربر"
              />
            </div>
          </template>
        </template>
      </SettingsTabs>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref } from 'vue'
import DashboardLayout from "../components/DashboardLayout.vue"
import SettingsTabs from "../components/SettingsTabs.vue"
import SettingInput from "../components/settings/SettingInput.vue"
import SettingTextarea from "../components/settings/SettingTextarea.vue"
import SettingSelect from "../components/settings/SettingSelect.vue"
import SettingToggle from "../components/settings/SettingToggle.vue"
import { useAppSettingsStore } from '../stores/appSettings'

const settingsStore = useAppSettingsStore()

// Import computed properties
const { settingsCategories } = settingsStore

const exportSettings = () => {
  try {
    const settingsJson = settingsStore.exportSettings()
    const blob = new Blob([settingsJson], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `flyvpn-settings-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    alert('تنظیمات با موفقیت خروجی گرفته شد!')
  } catch (error) {
    alert('خطا در خروجی گرفتن تنظیمات: ' + error.message)
  }
}

const importSettings = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const result = settingsStore.importSettings(e.target.result)
          if (result.success) {
            alert('تنظیمات با موفقیت وارد شد!')
            window.location.reload() // Reload to apply new settings
          } else {
            alert('خطا در وارد کردن تنظیمات: ' + result.message)
          }
        } catch (error) {
          alert('فایل نامعتبر است')
        }
      }
      reader.readAsText(file)
    }
  }
  input.click()
}

const resetSettings = () => {
  if (confirm('آیا مطمئن هستید که می‌خواهید تمام تنظیمات را به حالت پیش‌فرض بازنشانی کنید؟ این عمل قابل برگردان نیست.')) {
    settingsStore.resetToDefault()
    alert('تنظیمات به حالت پیش‌فرض بازنشانی شد!')
    window.location.reload()
  }
}

const saveCategorySettings = (categoryId) => {
  settingsStore.saveSettings()
  alert(`تنظیمات ${settingsCategories.value.find(cat => cat.id === categoryId)?.name} ذخیره شد!`)
}
</script>

<style scoped>
.page-content {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 12px 0;
  font-family: "Vazirmatn", sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-description {
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
  margin: 0 0 32px 0;
  font-family: "Vazirmatn", sans-serif;
}

.content-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.content-card h2 {
  color: #2d3748;
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 16px 0;
  font-family: "Vazirmatn", sans-serif;
}

.content-card p {
  color: #4a5568;
  font-size: 15px;
  line-height: 1.8;
  margin: 0;
  font-family: "Vazirmatn", sans-serif;
}

.settings-section {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e2e8f0;
}

.settings-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.settings-section h3 {
  color: #2d3748;
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 20px 0;
  font-family: "Vazirmatn", sans-serif;
  display: flex;
  align-items: center;
  gap: 8px;
}

.settings-section h3::before {
  content: '';
  width: 4px;
  height: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
}
</style>

