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
                :class="getTypeClass(config.type)"
              >
                {{ getProtocolLabel(config.type) }}
              </span>
            </td>
            <td class="config-content">
              <div class="content-preview">
                {{ getContentPreview(config.content, config.type) }}
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

const getProtocolLabel = (type) => {
  const labels = {
    link: 'V2Ray Link',
    json: 'JSON Config',
    openvpn: 'OpenVPN',
    sstp: 'SSTP',
    ssh: 'SSH'
  }
  return labels[type] || type
}

const getTypeClass = (type) => {
  const classes = {
    link: 'type-link',
    json: 'type-json',
    openvpn: 'type-ovpn',
    sstp: 'type-sstp',
    ssh: 'type-ssh'
  }
  return classes[type] || 'type-default'
}

const getContentPreview = (content, type) => {
  if (!content) return '-'

  // Handle SSH/SSTP JSON content
  if (['ssh', 'sstp'].includes(type)) {
    try {
      const parsed = JSON.parse(content)
      if (type === 'ssh') return `${parsed.username}@${parsed.host}:${parsed.port || 22}`
      if (type === 'sstp') return `${parsed.username}@${parsed.server}`
    } catch {
      return content.substring(0, 30) + '...'
    }
  }

  // برای لینک‌ها
  if (content.includes('://')) {
    try {
      const url = new URL(content)
      return `${url.protocol}//${url.hostname}${url.port ? ':' + url.port : ''}`
    } catch {
      return content.substring(0, 30) + '...'
    }
  }

  // اگر محتوای OpenVPN باشد (فایل متنی)
  if (content.includes('client') || content.includes('remote ')) {
    return 'OpenVPN Config File'
  }

  // برای JSON
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
  border-radius: 16px;
  background: rgba(0, 0, 0, 0.1);
}

.config-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-family: "Vazirmatn", sans-serif;
}

.config-table th {
  background: rgba(255, 255, 255, 0.02);
  padding: 20px 24px;
  text-align: right;
  color: #94a3b8;
  font-weight: 700;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.config-table td {
  padding: 20px 24px;
  text-align: right;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  color: #e2e8f0;
  vertical-align: middle;
}

.config-table tr:hover td {
  background: rgba(255, 255, 255, 0.02);
}

.config-name {
  font-weight: 700;
  color: #ffffff;
  font-size: 15px;
}

.config-type {
  padding: 8px 16px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.type-link { background: rgba(34, 197, 94, 0.1); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.2); }
.type-json { background: rgba(245, 158, 11, 0.1); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.2); }
.type-ovpn { background: rgba(59, 130, 246, 0.1); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.2); }
.type-sstp { background: rgba(168, 85, 247, 0.1); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.2); }
.type-ssh { background: rgba(148, 163, 184, 0.1); color: #94a3b8; border: 1px solid rgba(148, 163, 184, 0.2); }

.content-preview {
  font-family: 'Courier New', monospace;
  font-size: 13px;
  color: #94a3b8;
  opacity: 0.8;
  background: rgba(0, 0, 0, 0.2);
  padding: 6px 12px;
  border-radius: 8px;
  display: inline-block;
  max-width: 280px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.config-date {
  color: #64748b;
  font-size: 13px;
  direction: ltr;
}

.actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.edit-btn, .delete-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 10px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  font-size: 14px;
}

.edit-btn:hover {
  background: rgba(99, 102, 241, 0.15);
  border-color: rgba(99, 102, 241, 0.3);
  color: #818cf8;
  transform: translateY(-2px);
}

.delete-btn:hover {
  background: rgba(244, 63, 94, 0.15);
  border-color: rgba(244, 63, 94, 0.3);
  color: #fb7185;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .config-table-container { padding: 20px; border-radius: 20px; }
  .table-header { flex-direction: column; gap: 20px; align-items: stretch; }
  .config-table th, .config-table td { padding: 16px 12px; }
}
</style>
