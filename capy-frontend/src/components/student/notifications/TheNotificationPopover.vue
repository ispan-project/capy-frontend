<template>
  <el-popover
    v-model:visible="visible"
    placement="bottom-end"
    :width="360"
    trigger="click"
    popper-class="notification-popover"
  >
    <template #reference>
      <slot name="trigger">
        <el-button circle>
          <el-icon><Bell /></el-icon>
        </el-button>
      </slot>
    </template>

    <!-- Popover 內容 -->
    <div class="notification-popover-content">
      <!-- 標題列 -->
      <div class="notification-header">
        <h4 class="header-title">通知</h4>
        <el-button
          type="primary"
          link
          :disabled="notificationStore.unreadCount === 0"
          @click="handleMarkAllAsRead"
        >
          全部標為已讀
        </el-button>
      </div>

      <!-- 通知列表 -->
      <el-scrollbar max-height="400px" class="notification-scrollbar">
        <!-- 空狀態 -->
        <div v-if="notificationStore.notifications.length === 0" class="empty-state">
          <div class="empty-icon">
            <el-icon :size="48" color="#C0C4CC">
              <Bell />
            </el-icon>
          </div>
          <p class="empty-text">暫無新通知</p>
        </div>

        <!-- 通知項目列表 -->
        <div v-else class="notification-list">
          <div
            v-for="item in notificationStore.recentNotifications"
            :key="item.id"
            class="notification-item"
            :class="{ 'is-unread': !item.is_read }"
            @click="handleNotificationClick(item)"
          >
            <!-- 左側圖標 -->
            <div class="item-icon" :style="getIconStyle(item.notification_type)">
              <el-icon :size="18">
                <component :is="getIconComponent(item.notification_type)" />
              </el-icon>
            </div>

            <!-- 中間內容 -->
            <div class="item-content">
              <h5 class="item-title">{{ item.title }}</h5>
              <p v-if="item.content" class="item-description">{{ item.content }}</p>
              <span class="item-time">{{ formatRelativeTime(item.created_at) }}</span>
            </div>

            <!-- 右側未讀指示器 -->
            <div v-if="!item.is_read" class="item-indicator">
              <span class="unread-dot"></span>
            </div>
          </div>
        </div>
      </el-scrollbar>

      <!-- 底部按鈕 -->
      <div class="notification-footer">
        <el-button
          class="view-all-button"
          @click="handleViewAll"
        >
          查看所有通知
        </el-button>
      </div>
    </div>
  </el-popover>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Bell,
  Warning,
  CircleCloseFilled,
  ChatDotRound,
  UserFilled,
  Postcard,
  BellFilled,
  DocumentCopy,
  Star
} from '@element-plus/icons-vue'
import { useNotificationStore } from '@/stores/notification'

// ==================== Composables ====================

const router = useRouter()
const notificationStore = useNotificationStore()

// ==================== State ====================

const visible = ref(false)

// ==================== Methods ====================

/**
 * 根據通知類型獲取圖標組件
 * @param {string} type - 通知類型
 * @returns {Component} 圖標組件
 */
const getIconComponent = (type) => {
  const iconMap = {
    // Critical / Warning
    'account_suspended': Warning,
    'payout_failed': CircleCloseFilled,
    'transcoding_failed': Warning,
    'course_force_unpublished': CircleCloseFilled,
    
    // Interaction / Info
    'question_answered': ChatDotRound,
    'new_question': ChatDotRound,
    'new_enrollment': UserFilled,
    'new_review': Star,
    
    // Announcements
    'instructor_announcement': Postcard,
    'platform_announcement': BellFilled
  }
  
  return iconMap[type] || Bell
}

/**
 * 根據通知類型獲取圖標樣式
 * @param {string} type - 通知類型
 * @returns {Object} 樣式物件
 */
const getIconStyle = (type) => {
  // Critical / Warning - Red
  const criticalTypes = [
    'account_suspended',
    'payout_failed',
    'transcoding_failed',
    'course_force_unpublished'
  ]
  
  // Interaction / Info - Teal
  const interactionTypes = [
    'question_answered',
    'new_question',
    'new_enrollment',
    'new_review'
  ]
  
  // Announcements - Brown/Orange
  const announcementTypes = [
    'instructor_announcement',
    'platform_announcement'
  ]
  
  if (criticalTypes.includes(type)) {
    return {
      color: 'var(--capy-danger)',
      backgroundColor: 'var(--el-color-danger-light-9)'
    }
  } else if (interactionTypes.includes(type)) {
    return {
      color: 'var(--capy-primary)',
      backgroundColor: 'var(--el-color-primary-light-9)'
    }
  } else if (announcementTypes.includes(type)) {
    return {
      color: 'var(--capy-warning)',
      backgroundColor: 'var(--el-color-warning-light-9)'
    }
  }
  
  // Default
  return {
    color: 'var(--capy-info)',
    backgroundColor: 'var(--el-color-info-light-9)'
  }
}

/**
 * 格式化相對時間
 * @param {string} dateString - ISO 日期字串
 * @returns {string} 相對時間字串
 */
const formatRelativeTime = (dateString) => {
  const now = new Date()
  const date = new Date(dateString)
  const diffInSeconds = Math.floor((now - date) / 1000)
  
  if (diffInSeconds < 60) {
    return '剛剛'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} 分鐘前`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} 小時前`
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} 天前`
  } else if (diffInSeconds < 2592000) {
    const weeks = Math.floor(diffInSeconds / 604800)
    return `${weeks} 週前`
  } else {
    const months = Math.floor(diffInSeconds / 2592000)
    return `${months} 個月前`
  }
}

/**
 * 標記所有通知為已讀
 */
const handleMarkAllAsRead = () => {
  notificationStore.markAllAsRead()
  ElMessage.success('所有通知已標記為已讀')
}

/**
 * 處理通知點擊
 * @param {Object} item - 通知項目
 */
const handleNotificationClick = async (item) => {
  try {
    // 標記為已讀
    await notificationStore.markAsRead(item.id)
    
    // 關閉 popover
    visible.value = false
    
    // 根據通知類型和相關實體類型導航
    if (item.related_entity_type === 'course' && item.related_entity_id) {
      // 課程相關通知：導航到課程詳情頁
      await router.push({
        name: 'CourseDetail',
        params: { id: item.related_entity_id }
      }).catch(err => {
        console.warn('導航失敗:', err)
        // 如果導航失敗，嘗試導航到通知頁面
        return router.push({ name: 'Notifications' })
      })
    } else {
      // 其他類型或無相關實體：導航到通知頁面查看詳情
      await router.push({ name: 'Notifications' }).catch(err => {
        console.warn('導航失敗:', err)
      })
    }
  } catch (error) {
    console.error('處理通知點擊時發生錯誤:', error)
    ElMessage.error('處理通知時發生錯誤')
  }
}

/**
 * 查看所有通知
 */
const handleViewAll = async () => {
  try {
    visible.value = false
    await router.push({ name: 'Notifications' }).catch(err => {
      console.warn('導航失敗:', err)
    })
  } catch (error) {
    console.error('導航到通知頁面時發生錯誤:', error)
  }
}

// ==================== Lifecycle ====================

// 載入通知資料
notificationStore.fetchNotifications()
</script>

<style scoped>
/* ==================== Popover 內容 ==================== */

.notification-popover-content {
  display: flex;
  flex-direction: column;
}

/* ==================== 標題列 ==================== */

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--capy-spacing-sm);
  border-bottom: 1px solid var(--capy-border-lighter);
  margin-bottom: var(--capy-spacing-sm);
}

.header-title {
  margin: 0;
  font-size: var(--capy-font-size-base);
  font-weight: var(--capy-font-weight-semibold);
  color: var(--capy-text-primary);
}

/* ==================== 空狀態 ==================== */

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--capy-spacing-xl) var(--capy-spacing-md);
  text-align: center;
}

.empty-icon {
  margin-bottom: var(--capy-spacing-md);
}

.empty-text {
  font-size: var(--capy-font-size-base);
  color: var(--capy-text-secondary);
  margin: 0;
}

/* ==================== 通知列表 ==================== */

.notification-list {
  display: flex;
  flex-direction: column;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: var(--capy-spacing-sm);
  padding: var(--capy-spacing-sm);
  border-radius: var(--capy-radius-sm);
  cursor: pointer;
  transition: background-color var(--capy-transition-fast);
}

.notification-item:hover {
  background-color: var(--capy-bg-elevated);
}

.notification-item.is-unread {
  background-color: var(--el-color-primary-light-9);
}

.notification-item.is-unread:hover {
  background-color: var(--el-color-primary-light-8);
}

/* 圖標 */
.item-icon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: var(--capy-radius-circle);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--capy-transition-fast);
}

/* 內容 */
.item-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.item-title {
  font-size: var(--capy-font-size-sm);
  font-weight: var(--capy-font-weight-semibold);
  color: var(--capy-text-primary);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-description {
  font-size: var(--capy-font-size-xs);
  color: var(--capy-text-secondary);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-time {
  font-size: var(--capy-font-size-xs);
  color: var(--capy-text-placeholder);
}

/* 未讀指示器 */
.item-indicator {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding-top: 4px;
}

.unread-dot {
  width: 8px;
  height: 8px;
  border-radius: var(--capy-radius-circle);
  background-color: var(--capy-primary);
}

/* ==================== 底部 ==================== */

.notification-footer {
  padding-top: var(--capy-spacing-sm);
  border-top: 1px solid var(--capy-border-lighter);
  margin-top: var(--capy-spacing-sm);
}

.view-all-button {
  width: 100%;
  font-size: var(--capy-font-size-sm);
  font-weight: var(--capy-font-weight-medium);
}

/* ==================== Scrollbar 樣式 ==================== */

.notification-scrollbar :deep(.el-scrollbar__wrap) {
  overflow-x: hidden;
}
</style>

<style>
/* ==================== Popover 全局樣式 ==================== */

.notification-popover.el-popper {
  padding: var(--capy-spacing-md) !important;
}
</style>