<template>
  <div class="ads-table-container">
    <div class="table-header">
      <h3>مدیریت تبلیغات</h3>
      <button
        class="add-btn"
        @click="$emit('add-ad')"
      >
        <span>+</span>
        افزودن تبلیغ جدید
      </button>
    </div>

    <div class="table-wrapper">
      <table class="ads-table" v-if="ads.length > 0">
        <thead>
          <tr>
            <th>نام تبلیغ</th>
            <th>نوع</th>
            <th>پلتفرم</th>
            <th>کلید تبلیغ</th>
            <th>وضعیت</th>
            <th>تاریخ ایجاد</th>
            <th>عملیات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ad in ads" :key="ad.id">
            <td class="ad-name">{{ ad.name }}</td>
            <td>
              <span
                class="ad-type"
                :class="{
                  'type-banner': ad.type === 'banner',
                  'type-video': ad.type === 'video' || ad.type === 'video_ad',
                  'type-reward': ad.type === 'reward'
                }"
              >
                <span class="type-icon" v-if="ad.type === 'banner'">📄</span>
                <span class="type-icon" v-else-if="ad.type === 'video' || ad.type === 'video_ad'">🎥</span>
                <span class="type-icon" v-else>🎁</span>
                {{ ad.type === 'banner' ? 'بنر' : (ad.type === 'video' || ad.type === 'video_ad') ? 'ویدیو' : 'جایزه‌ای' }}
              </span>
            </td>
            <td>
              <span class="platform-badge" :class="ad.platform">
                <span v-if="ad.platform === 'android'">🤖</span>
                <span v-else-if="ad.platform === 'ios'">🍎</span>
                <span v-else>🌐</span>
                {{ ad.platform === 'android' ? 'Android' : ad.platform === 'ios' ? 'iOS' : 'هر دو' }}
              </span>
            </td>
            <td class="ad-key">
              <div class="key-preview">
                {{ ad.adUnitId.length > 30 ? ad.adUnitId.substring(0, 30) + '...' : ad.adUnitId }}
              </div>
              <button
                class="copy-btn"
                @click="copyToClipboard(ad.adUnitId)"
                title="کپی کلید"
              >
                📋
              </button>
            </td>
            <td>
              <span
                class="status-badge"
                :class="ad.isActive ? 'active' : 'inactive'"
              >
                {{ ad.isActive ? 'فعال' : 'غیرفعال' }}
              </span>
            </td>
            <td class="ad-date">
              {{ formatDate(ad.createdAt) }}
            </td>
            <td class="actions">
              <button
                class="edit-btn"
                @click="$emit('edit-ad', ad)"
                title="ویرایش"
              >
                ✏️
              </button>
              <button
                class="status-btn"
                @click="$emit('toggle-status', ad)"
                :title="ad.isActive ? 'غیرفعال کردن' : 'فعال کردن'"
              >
                {{ ad.isActive ? '🚫' : '✅' }}
              </button>
              <button
                class="delete-btn"
                @click="confirmDelete(ad)"
                title="حذف"
              >
                🗑️
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="empty-state" v-else>
        <div class="empty-icon">📢</div>
        <h4>هیچ تبلیغی یافت نشد</h4>
        <p>برای شروع، یک تبلیغ جدید اضافه کنید.</p>
        <button
          class="add-btn-empty"
          @click="$emit('add-ad')"
        >
          افزودن اولین تبلیغ
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue'

defineProps({
  ads: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['add-ad', 'edit-ad', 'toggle-status', 'delete-ad'])

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    // می‌توانیم یک toast notification اضافه کنیم
    console.log('کلید کپی شد:', text)
  } catch (err) {
    console.error('خطا در کپی کردن:', err)
  }
}

const confirmDelete = (ad) => {
  if (confirm(`آیا مطمئن هستید که می‌خواهید تبلیغ "${ad.name}" را حذف کنید؟`)) {
    emit('delete-ad', ad.id)
  }
}
</script>

<style scoped>
.ads-table-container {
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(25px) saturate(180%);
  border-radius: 28px;
  padding: 32px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
  margin-top: 32px;
  animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.table-header h3 {
  color: #ffffff;
  font-size: 22px;
  font-weight: 800;
  margin: 0;
  font-family: "Vazirmatn", sans-serif;
}

.add-btn {
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 16px;
  font-weight: 700;
  font-family: "Vazirmatn", sans-serif;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 8px 16px rgba(99, 102, 241, 0.3);
}

.add-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(99, 102, 241, 0.5);
  filter: brightness(1.1);
}

.table-wrapper {
  overflow-x: auto;
  border-radius: 20px;
  background: rgba(0, 0, 0, 0.1);
}

.ads-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.ads-table th {
  padding: 20px 24px;
  text-align: right;
  color: #94a3b8;
  font-weight: 700;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.ads-table td {
  padding: 20px 24px;
  text-align: right;
  color: #e2e8f0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
}

.ads-table tr:hover td {
  background: rgba(255, 255, 255, 0.02);
}

.ad-name { font-weight: 700; color: #ffffff; }

.ad-type {
  padding: 6px 14px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 6px;
  text-transform: uppercase;
}

.type-banner { background: rgba(34, 197, 94, 0.1); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.2); }
.type-video { background: rgba(245, 158, 11, 0.1); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.2); }
.type-reward { background: rgba(168, 85, 247, 0.1); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.2); }

.platform-badge {
  padding: 6px 12px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.05);
  color: #94a3b8;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.platform-badge.android { background: rgba(34, 197, 94, 0.1); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.2); }
.platform-badge.ios { background: rgba(59, 130, 246, 0.1); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.2); }

.ad-key { display: flex; align-items: center; gap: 10px; }
.key-preview { font-family: 'Courier New', monospace; font-size: 13px; opacity: 0.7; }

.status-badge {
  padding: 6px 14px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 800;
}

.status-badge.active { background: rgba(34, 197, 94, 0.1); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.2); }
.status-badge.inactive { background: rgba(244, 63, 94, 0.1); color: #fb7185; border: 1px solid rgba(244, 63, 94, 0.2); }

.actions { display: flex; gap: 10px; justify-content: flex-end; }
.edit-btn, .status-btn, .delete-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 10px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit-btn:hover { background: rgba(99, 102, 241, 0.15); color: #818cf8; transform: translateY(-2px); }
.status-btn:hover { background: rgba(245, 158, 11, 0.15); color: #fbbf24; transform: translateY(-2px); }
.delete-btn:hover { background: rgba(244, 63, 94, 0.15); color: #fb7185; transform: translateY(-2px); }

@media (max-width: 768px) {
  .ads-table-container { padding: 20px; border-radius: 20px; }
  .table-header { flex-direction: column; gap: 20px; align-items: stretch; }
  .ads-table th, .ads-table td { padding: 16px 12px; }
}
</style>
