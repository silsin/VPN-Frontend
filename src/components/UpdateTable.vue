<template>
  <div class="update-table-container">
    <div class="table-header">
      <h3>تاریخچه انتشار</h3>
      <button
        class="add-btn"
        @click="$emit('add-update')"
      >
        <span>+</span>
        انتشار نسخه جدید
      </button>
    </div>

    <!-- اطلاعات نسخه فعلی -->
    <div v-if="latestUpdate" class="current-version-card">
      <div class="version-header">
        <div class="version-info">
          <div class="version-badge">
            <span class="version-icon">📱</span>
            <span>نسخه فعلی</span>
          </div>
          <h4>{{ latestUpdate.versionName }}</h4>
          <div class="version-details">
            <span class="version-code">کد: {{ latestUpdate.versionCode }}</span>
            <span class="version-platform">
              <span v-if="latestUpdate.platform === 'both'">📱</span>
              <span v-else-if="latestUpdate.platform === 'android'">🤖</span>
              <span v-else>🍎</span>
              {{ getPlatformLabel(latestUpdate.platform) }}
            </span>
          </div>
        </div>
        <div class="version-status">
          <span
            class="status-badge"
            :class="latestUpdate.updateType"
          >
            {{ latestUpdate.updateType === 'force' ? 'اجباری' : 'معمولی' }}
          </span>
        </div>
      </div>

      <div class="version-release-notes">
        <h5>تغییرات این نسخه:</h5>
        <ul>
          <li v-for="note in latestUpdate.releaseNotes" :key="note">{{ note }}</li>
        </ul>
      </div>

      <div class="version-meta">
        <div class="meta-item">
          <span class="meta-label">تاریخ انتشار:</span>
          <span class="meta-value">{{ formatDate(latestUpdate.releasedAt) }}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">حداقل نسخه پشتیبانی:</span>
          <span class="meta-value">{{ latestUpdate.minSupportedVersion }}</span>
        </div>
      </div>
    </div>

    <div class="table-wrapper">
      <table class="update-table" v-if="updates.length > 0">
        <thead>
          <tr>
            <th>نسخه</th>
            <th>پلتفرم</th>
            <th>نوع آپدیت</th>
            <th>وضعیت</th>
            <th>تاریخ انتشار</th>
            <th>تغییرات</th>
            <th>عملیات</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="update in updates"
            :key="update.id"
            :class="{ 'latest-row': update.isLatest }"
          >
            <td class="version-cell">
              <div class="version-name">{{ update.versionName }}</div>
              <div class="version-code">کد: {{ update.versionCode }}</div>
              <div v-if="update.isLatest" class="latest-badge">جدیدترین</div>
            </td>
            <td>
              <span class="platform-badge" :class="update.platform">
                <span v-if="update.platform === 'both'">📱</span>
                <span v-else-if="update.platform === 'android'">🤖</span>
                <span v-else>🍎</span>
                {{ getPlatformLabel(update.platform) }}
              </span>
            </td>
            <td>
              <span
                class="update-type-badge"
                :class="update.updateType"
              >
                {{ update.updateType === 'force' ? 'اجباری' : 'معمولی' }}
              </span>
            </td>
            <td>
              <span
                class="status-badge"
                :class="update.status"
              >
                {{ update.status === 'active' ? 'فعال' : 'غیرفعال' }}
              </span>
            </td>
            <td class="release-date">
              <div v-if="update.releasedAt">
                {{ formatDate(update.releasedAt) }}
              </div>
              <div v-else class="no-date">
                منتشر نشده
              </div>
            </td>
            <td class="release-notes">
              <div class="notes-preview">
                <span v-for="note in update.releaseNotes.slice(0, 2)" :key="note" class="note-item">
                  • {{ note }}
                </span>
                <span v-if="update.releaseNotes.length > 2" class="more-notes">
                  و {{ update.releaseNotes.length - 2 }} مورد دیگر...
                </span>
              </div>
            </td>
            <td class="actions">
              <button
                class="view-btn"
                @click="$emit('view-update', update)"
                title="مشاهده جزئیات"
              >
                👁️
              </button>
              <button
                v-if="update.status === 'inactive'"
                class="edit-btn"
                @click="$emit('edit-update', update)"
                title="ویرایش"
              >
                ✏️
              </button>
              <button
                v-if="update.status === 'inactive'"
                class="activate-btn"
                @click="$emit('activate-update', update)"
                title="فعال کردن"
              >
                ✅
              </button>
              <button
                v-if="update.status === 'inactive'"
                class="delete-btn"
                @click="confirmDelete(update)"
                title="حذف"
              >
                🗑️
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="empty-state" v-else>
        <div class="empty-icon">📦</div>
        <h4>هیچ نسخه‌ای یافت نشد</h4>
        <p>برای شروع، اولین نسخه اپلیکیشن را اضافه کنید.</p>
        <button
          class="add-btn-empty"
          @click="$emit('add-update')"
        >
          افزودن اولین نسخه
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue'

defineProps({
  updates: {
    type: Array,
    default: () => []
  },
  latestUpdate: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['add-update', 'edit-update', 'activate-update', 'view-update', 'delete-update'])

const getPlatformLabel = (platform) => {
  const labels = {
    'android': 'Android',
    'ios': 'iOS',
    'both': 'هر دو'
  }
  return labels[platform] || platform
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

const confirmDelete = (update) => {
  if (confirm(`آیا مطمئن هستید که می‌خواهید نسخه "${update.versionName}" را حذف کنید؟`)) {
    emit('delete-update', update.id)
  }
}
</script>

<style scoped>
.update-table-container {
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

.current-version-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
}

.version-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.version-info h4 {
  margin: 8px 0 12px 0;
  font-size: 28px;
  font-weight: 700;
  font-family: "Vazirmatn", sans-serif;
}

.version-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.2);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  font-family: "Vazirmatn", sans-serif;
}

.version-details {
  display: flex;
  gap: 16px;
  margin-top: 8px;
}

.version-code,
.version-platform {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  opacity: 0.9;
}

.version-status .status-badge {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  font-family: "Vazirmatn", sans-serif;
  background: rgba(255, 255, 255, 0.2);
}

.version-release-notes {
  margin-bottom: 20px;
}

.version-release-notes h5 {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  font-family: "Vazirmatn", sans-serif;
}

.version-release-notes ul {
  margin: 0;
  padding-right: 20px;
}

.version-release-notes li {
  margin-bottom: 6px;
  font-size: 14px;
  line-height: 1.5;
  opacity: 0.9;
}

.version-meta {
  display: flex;
  gap: 24px;
  font-size: 13px;
  opacity: 0.8;
}

.meta-item {
  display: flex;
  gap: 6px;
}

.meta-label {
  font-weight: 600;
}

.table-wrapper {
  overflow-x: auto;
}

.update-table {
  width: 100%;
  border-collapse: collapse;
  font-family: "Vazirmatn", sans-serif;
}

.update-table th,
.update-table td {
  padding: 16px;
  text-align: right;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.update-table th {
  background: rgba(102, 126, 234, 0.1);
  color: #2d3748;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.update-table tr:hover {
  background: rgba(102, 126, 234, 0.05);
}

.update-table tr.latest-row {
  background: rgba(16, 185, 129, 0.05);
  border-left: 4px solid #10b981;
}

.version-cell {
  min-width: 120px;
}

.version-name {
  font-weight: 600;
  color: #2d3748;
  font-size: 16px;
  margin-bottom: 4px;
}

.version-code {
  font-size: 12px;
  color: #718096;
  margin-bottom: 4px;
}

.latest-badge {
  display: inline-block;
  background: #10b981;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  font-family: "Vazirmatn", sans-serif;
}

.platform-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
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

.update-type-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.update-type-badge.force {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.active {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.status-badge.inactive {
  background: rgba(107, 114, 128, 0.1);
  color: #6b7280;
}

.release-date {
  min-width: 140px;
  font-size: 13px;
}

.no-date {
  color: #718096;
  font-style: italic;
}

.release-notes {
  max-width: 250px;
}

.notes-preview {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.note-item {
  font-size: 12px;
  color: #4a5568;
  line-height: 1.4;
}

.more-notes {
  font-size: 11px;
  color: #718096;
  font-style: italic;
}

.actions {
  display: flex;
  gap: 6px;
  justify-content: center;
  flex-wrap: wrap;
}

.view-btn,
.edit-btn,
.activate-btn,
.delete-btn {
  background: none;
  border: none;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.view-btn:hover {
  background: rgba(102, 126, 234, 0.1);
  transform: scale(1.1);
}

.edit-btn:hover {
  background: rgba(59, 130, 246, 0.1);
  transform: scale(1.1);
}

.activate-btn:hover {
  background: rgba(16, 185, 129, 0.1);
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
  .update-table-container {
    padding: 20px;
  }

  .table-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .current-version-card {
    padding: 20px;
  }

  .version-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .version-meta {
    flex-direction: column;
    gap: 8px;
  }

  .update-table th,
  .update-table td {
    padding: 12px 8px;
  }

  .actions {
    gap: 4px;
  }

  .view-btn,
  .edit-btn,
  .activate-btn,
  .delete-btn {
    padding: 6px;
    font-size: 12px;
  }
}
</style>
