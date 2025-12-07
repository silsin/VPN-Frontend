<template>
  <div class="config-table-container">
    <div class="table-header">
      <h3>لیست کانفیگ‌ها</h3>
      <button
        class="add-btn"
        @click="$emit('add-config')"
      >
        <span>+</span>
        افزودن کانفیگ جدید
      </button>
    </div>

    <div class="table-wrapper">
      <table class="config-table" v-if="configs.length > 0">
        <thead>
          <tr>
            <th>نام کانفیگ</th>
            <th>پرچم</th>
            <th>نوع</th>
            <th>محتوا</th>
            <th>تاریخ ایجاد</th>
            <th>عملیات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="config in configs" :key="config.id">
            <td class="config-name">{{ config.name }}</td>
            <td class="config-flag">
              <span v-if="config.country" :class="`fi fi-${config.country}`"></span>
              <span v-else>-</span>
            </td>
            <td>
              <span
                class="config-type"
                :class="config.type === 'link' ? 'type-link' : 'type-json'"
              >
                {{ config.type === 'link' ? 'لینک V2Ray' : 'کانفیگ JSON' }}
              </span>
            </td>
            <td class="config-content">
              <div class="content-preview">
                {{ getContentPreview(config.content) }}
              </div>
            </td>
            <td class="config-date">
              {{ formatDate(config.createdAt) }}
            </td>
            <td class="actions">
              <button
                class="edit-btn"
                @click="$emit('edit-config', config)"
                title="ویرایش"
              >
                ✏️
              </button>
              <button
                class="delete-btn"
                @click="confirmDelete(config)"
                title="حذف"
              >
                🗑️
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="empty-state" v-else>
        <div class="empty-icon">📋</div>
        <h4>هیچ کانفیگی یافت نشد</h4>
        <p>برای شروع، یک کانفیگ جدید اضافه کنید.</p>
        <button
          class="add-btn-empty"
          @click="$emit('add-config')"
        >
          افزودن اولین کانفیگ
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue'

defineProps({
  configs: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['add-config', 'edit-config', 'delete-config'])

const getContentPreview = (content) => {
  if (!content) return '-'

  // برای لینک‌ها، فقط پروتکل و آدرس سرور نمایش داده شود
  if (content.includes('://')) {
    const url = new URL(content)
    return `${url.protocol}//${url.hostname}${url.port ? ':' + url.port : ''}`
  }

  // برای JSON، فقط نام نمایش داده شود اگر موجود باشد
  try {
    const parsed = JSON.parse(content)
    return parsed.ps || parsed.name || 'کانفیگ JSON'
  } catch {
    return content.length > 50 ? content.substring(0, 50) + '...' : content
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const confirmDelete = (config) => {
  if (confirm(`آیا مطمئن هستید که می‌خواهید کانفیگ "${config.name}" را حذف کنید؟`)) {
    emit('delete-config', config.id)
  }
}
</script>

<style scoped>
.config-table-container {
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

.config-table {
  width: 100%;
  border-collapse: collapse;
  font-family: "Vazirmatn", sans-serif;
}

.config-table th,
.config-table td {
  padding: 16px;
  text-align: right;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.config-table th {
  background: rgba(102, 126, 234, 0.1);
  color: #2d3748;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.config-table tr:hover {
  background: rgba(102, 126, 234, 0.05);
}

.config-name {
  font-weight: 600;
  color: #2d3748;
}

.config-flag span {
  font-size: 20px;
  border-radius: 4px;
  display: block; /* Ensure it stays neat */
}

.config-type {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.type-link {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
}

.type-json {
  background: rgba(251, 146, 60, 0.1);
  color: #ea580c;
}

.config-content {
  max-width: 300px;
}

.content-preview {
  font-family: 'Courier New', monospace;
  font-size: 13px;
  color: #4a5568;
  word-break: break-all;
}

.config-date {
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
  .config-table-container {
    padding: 20px;
  }

  .table-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .config-table th,
  .config-table td {
    padding: 12px 8px;
  }

  .config-content {
    max-width: 150px;
  }

  .content-preview {
    font-size: 12px;
  }
}
</style>
