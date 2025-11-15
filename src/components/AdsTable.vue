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
                :class="ad.type === 'banner' ? 'type-banner' : 'type-video'"
              >
                <span class="type-icon" v-if="ad.type === 'banner'">📄</span>
                <span class="type-icon" v-else>🎥</span>
                {{ ad.type === 'banner' ? 'بنر' : 'ویدیو' }}
              </span>
            </td>
            <td>
              <span class="platform-badge" :class="ad.platform">
                <span v-if="ad.platform === 'android'">🤖</span>
                <span v-else-if="ad.platform === 'ios'">🍎</span>
                <span v-else>📱</span>
                {{ ad.platform === 'both' ? 'هر دو' : ad.platform === 'android' ? 'Android' : 'iOS' }}
              </span>
            </td>
            <td class="ad-key">
              <div class="key-preview">
                {{ ad.key.length > 30 ? ad.key.substring(0, 30) + '...' : ad.key }}
              </div>
              <button
                class="copy-btn"
                @click="copyToClipboard(ad.key)"
                title="کپی کلید"
              >
                📋
              </button>
            </td>
            <td>
              <span
                class="status-badge"
                :class="ad.status"
              >
                {{ ad.status === 'active' ? 'فعال' : 'غیرفعال' }}
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
                :title="ad.status === 'active' ? 'غیرفعال کردن' : 'فعال کردن'"
              >
                {{ ad.status === 'active' ? '🚫' : '✅' }}
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
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.table-header h3 {
  color: #2d3748;
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  font-family: "Vazirmatn", sans-serif;
}

.add-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 12px;
  font-weight: 600;
  font-family: "Vazirmatn", sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.add-btn span {
  font-size: 18px;
  font-weight: bold;
}

.table-wrapper {
  overflow-x: auto;
}

.ads-table {
  width: 100%;
  border-collapse: collapse;
  font-family: "Vazirmatn", sans-serif;
}

.ads-table th,
.ads-table td {
  padding: 16px;
  text-align: right;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.ads-table th {
  background: rgba(102, 126, 234, 0.1);
  color: #2d3748;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.ads-table tr:hover {
  background: rgba(102, 126, 234, 0.05);
}

.ad-name {
  font-weight: 600;
  color: #2d3748;
}

.ad-type {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}

.type-banner {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
}

.type-video {
  background: rgba(251, 146, 60, 0.1);
  color: #ea580c;
}

.platform-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

.platform-badge.android {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
}

.platform-badge.ios {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.ad-key {
  max-width: 250px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.key-preview {
  font-family: 'Courier New', monospace;
  font-size: 13px;
  color: #4a5568;
  flex: 1;
}

.copy-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
  font-size: 14px;
}

.copy-btn:hover {
  background: rgba(102, 126, 234, 0.1);
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.active {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
}

.status-badge.inactive {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.ad-date {
  color: #718096;
  font-size: 13px;
  direction: ltr;
}

.actions {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.edit-btn,
.status-btn,
.delete-btn {
  background: none;
  border: none;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 16px;
}

.edit-btn:hover {
  background: rgba(59, 130, 246, 0.1);
  transform: scale(1.1);
}

.status-btn:hover {
  background: rgba(251, 146, 60, 0.1);
  transform: scale(1.1);
}

.delete-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  transform: scale(1.1);
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #718096;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state h4 {
  color: #2d3748;
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
  font-family: "Vazirmatn", sans-serif;
}

.empty-state p {
  margin: 0 0 24px 0;
  font-family: "Vazirmatn", sans-serif;
}

.add-btn-empty {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 12px;
  font-weight: 600;
  font-family: "Vazirmatn", sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-btn-empty:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

@media (max-width: 768px) {
  .ads-table-container {
    padding: 20px;
  }

  .table-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .ads-table th,
  .ads-table td {
    padding: 12px 8px;
  }

  .ad-key {
    max-width: 150px;
  }

  .key-preview {
    font-size: 12px;
  }
}
</style>
