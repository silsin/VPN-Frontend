<template>
  <div class="dialog-table-container">
    <div class="table-header">
      <h3>مدیریت دیالوگ‌ها و اعلان‌ها</h3>
      <button
        class="add-btn"
        @click="$emit('add-dialog')"
      >
        <span>+</span>
        افزودن جدید
      </button>
    </div>

    <div class="table-wrapper">
      <table class="dialog-table" v-if="dialogs.length > 0">
        <thead>
          <tr>
            <th>عنوان</th>
            <th>نوع</th>
            <th>هدف</th>
            <th>وضعیت</th>
            <th>اولویت</th>
            <th>زمان ارسال</th>
            <th>عملیات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="dialog in dialogs" :key="dialog.id">
            <td class="dialog-title">
              <div class="title-content">
                <div class="title-text">{{ dialog.title }}</div>
                <div class="message-preview">{{ getMessagePreview(dialog.message) }}</div>
              </div>
            </td>
            <td>
              <span
                class="type-badge"
                :class="dialog.type"
              >
                <span class="type-icon" v-if="dialog.type === 'dialog'">💬</span>
                <span class="type-icon" v-else>🔔</span>
                {{ dialog.type === 'dialog' ? 'دیالوگ' : 'Push' }}
              </span>
              <div v-if="dialog.type === 'dialog'" class="dialog-type">
                <span
                  class="dialog-type-badge"
                  :style="{ backgroundColor: getDialogTypeColor(dialog.dialogType) }"
                >
                  {{ getDialogTypeLabel(dialog.dialogType) }}
                </span>
              </div>
            </td>
            <td>
              <span class="target-badge" :class="dialog.target">
                {{ getTargetLabel(dialog.target) }}
              </span>
            </td>
            <td>
              <span
                class="status-badge"
                :class="dialog.status"
              >
                {{ getStatusLabel(dialog.status) }}
              </span>
            </td>
            <td>
              <span
                class="priority-badge"
                :class="dialog.priority"
              >
                {{ getPriorityLabel(dialog.priority) }}
              </span>
            </td>
            <td class="send-time">
              <div v-if="dialog.sentTime" class="time-info">
                <div class="time-date">{{ formatDate(dialog.sentTime) }}</div>
                <div class="time-label">ارسال شده</div>
              </div>
              <div v-else-if="dialog.scheduleTime" class="time-info">
                <div class="time-date">{{ formatDate(dialog.scheduleTime) }}</div>
                <div class="time-label">برنامه‌ریزی شده</div>
              </div>
              <div v-else class="time-info">
                <div class="time-label">پیش‌نویس</div>
              </div>
            </td>
            <td class="actions">
              <button
                v-if="dialog.status === 'draft'"
                class="edit-btn"
                @click="$emit('edit-dialog', dialog)"
                title="ویرایش"
              >
                ✏️
              </button>

              <button
                v-if="dialog.status === 'draft' || dialog.status === 'scheduled'"
                class="send-btn"
                @click="$emit('send-dialog', dialog)"
                title="ارسال"
              >
                📤
              </button>

              <button
                v-if="dialog.status === 'scheduled'"
                class="cancel-btn"
                @click="$emit('cancel-scheduled', dialog)"
                title="لغو برنامه‌ریزی"
              >
                ❌
              </button>

              <button
                v-if="dialog.status !== 'sent'"
                class="delete-btn"
                @click="confirmDelete(dialog)"
                title="حذف"
              >
                🗑️
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="empty-state" v-else>
        <div class="empty-icon">💬</div>
        <h4>هیچ دیالوگ یا اعلانی یافت نشد</h4>
        <p>برای شروع، یک دیالوگ یا اعلان جدید اضافه کنید.</p>
        <button
          class="add-btn-empty"
          @click="$emit('add-dialog')"
        >
          افزودن اولین مورد
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue'
import { useDialogStore } from '../stores/dialog'

defineProps({
  dialogs: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['add-dialog', 'edit-dialog', 'send-dialog', 'cancel-scheduled', 'delete-dialog'])

const dialogStore = useDialogStore()

const getMessagePreview = (message) => {
  if (!message) return ''
  return message.length > 50 ? message.substring(0, 50) + '...' : message
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getDialogTypeLabel = (type) => {
  const types = {
    'info': 'اطلاع‌رسانی',
    'success': 'موفقیت',
    'warning': 'هشدار',
    'error': 'خطا'
  }
  return types[type] || type
}

const getDialogTypeColor = (type) => {
  const colors = {
    'info': '#3b82f6',
    'success': '#10b981',
    'warning': '#f59e0b',
    'error': '#ef4444'
  }
  return colors[type] || '#6b7280'
}

const getTargetLabel = (target) => {
  const targets = {
    'all': 'همه',
    'android': 'Android',
    'ios': 'iOS',
    'specific_users': 'کاربران خاص'
  }
  return targets[target] || target
}

const getStatusLabel = (status) => {
  const statuses = {
    'draft': 'پیش‌نویس',
    'scheduled': 'برنامه‌ریزی',
    'sent': 'ارسال شده',
    'cancelled': 'لغو شده'
  }
  return statuses[status] || status
}

const getPriorityLabel = (priority) => {
  const priorities = {
    'low': 'کم',
    'normal': 'معمولی',
    'high': 'زیاد',
    'urgent': 'فوری'
  }
  return priorities[priority] || priority
}

const confirmDelete = (dialog) => {
  if (confirm(`آیا مطمئن هستید که می‌خواهید "${dialog.title}" را حذف کنید؟`)) {
    emit('delete-dialog', dialog.id)
  }
}
</script>

<style scoped>
.dialog-table-container {
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

.dialog-table {
  width: 100%;
  border-collapse: collapse;
  font-family: "Vazirmatn", sans-serif;
}

.dialog-table th,
.dialog-table td {
  padding: 16px;
  text-align: right;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.dialog-table th {
  background: rgba(102, 126, 234, 0.1);
  color: #2d3748;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dialog-table tr:hover {
  background: rgba(102, 126, 234, 0.05);
}

.dialog-title {
  max-width: 250px;
}

.title-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.title-text {
  font-weight: 600;
  color: #2d3748;
}

.message-preview {
  font-size: 12px;
  color: #718096;
  line-height: 1.4;
}

.type-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.type-badge.dialog {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.type-badge.push {
  background: rgba(168, 85, 247, 0.1);
  color: #a855f7;
}

.dialog-type {
  margin-top: 4px;
}

.dialog-type-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  color: white;
}

.target-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

.target-badge.android {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
}

.target-badge.ios {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.draft {
  background: rgba(107, 114, 128, 0.1);
  color: #6b7280;
}

.status-badge.scheduled {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.status-badge.sent {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.status-badge.cancelled {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.priority-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.priority-badge.low {
  background: rgba(107, 114, 128, 0.1);
  color: #6b7280;
}

.priority-badge.normal {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.priority-badge.high {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.priority-badge.urgent {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.send-time {
  min-width: 120px;
}

.time-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.time-date {
  font-size: 12px;
  font-weight: 600;
  color: #2d3748;
  direction: ltr;
}

.time-label {
  font-size: 11px;
  color: #718096;
}

.actions {
  display: flex;
  gap: 6px;
  justify-content: center;
  flex-wrap: wrap;
}

.edit-btn,
.send-btn,
.cancel-btn,
.delete-btn {
  background: none;
  border: none;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.edit-btn:hover {
  background: rgba(59, 130, 246, 0.1);
  transform: scale(1.1);
}

.send-btn:hover {
  background: rgba(16, 185, 129, 0.1);
  transform: scale(1.1);
}

.cancel-btn:hover {
  background: rgba(245, 158, 11, 0.1);
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
  .dialog-table-container {
    padding: 20px;
  }

  .table-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .dialog-table th,
  .dialog-table td {
    padding: 12px 8px;
  }

  .dialog-title {
    max-width: 150px;
  }

  .actions {
    gap: 4px;
  }

  .edit-btn,
  .send-btn,
  .cancel-btn,
  .delete-btn {
    padding: 6px;
    font-size: 12px;
  }
}
</style>
