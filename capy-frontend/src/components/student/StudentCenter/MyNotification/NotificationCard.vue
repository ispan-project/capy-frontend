<template>
  <div
    class="notification-card"
    :class="{ unread: !notification.isRead }"
    @click="handleClick"
  >
    <!-- Icon -->
    <div
      class="notification-icon"
      :style="{
        color: notificationStyle.color,
        backgroundColor: notificationStyle.backgroundColor
      }"
    >
      <el-icon :size="20">
        <component :is="notificationStyle.icon" />
      </el-icon>
    </div>

    <!-- Content -->
    <div class="notification-content">
      <div class="notification-header">
        <h3 class="notification-title">{{ notification.title }}</h3>
        <span class="notification-time">{{ formattedTime }}</span>
      </div>
      <div class="notification-meta">
        <span class="notification-type">{{ notificationTypeLabel }}</span>
      </div>
      <p class="notification-message">{{ notification.content }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  BellFilled,
  ChatDotRound,
  Postcard,
  CircleCloseFilled,
  CircleCheckFilled,
  Reading,
  SuccessFilled,
  WarningFilled,
  CircleClose
} from '@element-plus/icons-vue'
import { NotificationType } from '@/types/notification'

const props = defineProps({
  notification: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click'])

// Get notification style based on type
const notificationStyle = computed(() => {
  const styleMap = {
    // Critical / Warning - Red
    [NotificationType.AccountSuspended]: {
      color: 'var(--capy-danger)',
      backgroundColor: 'var(--el-color-danger-light-9)',
      icon: CircleCloseFilled
    },
    [NotificationType.CourseForceUnpublished]: {
      color: 'var(--capy-danger)',
      backgroundColor: 'var(--el-color-danger-light-9)',
      icon: CircleCloseFilled
    },
    [NotificationType.TranscodingFailed]: {
      color: 'var(--capy-warning)',
      backgroundColor: 'var(--el-color-warning-light-9)',
      icon: WarningFilled
    },
    [NotificationType.PayoutFailed]: {
      color: 'var(--capy-warning)',
      backgroundColor: 'var(--el-color-warning-light-9)',
      icon: CircleClose
    },

    // Success / Positive - Green
    [NotificationType.AccountRestored]: {
      color: 'var(--capy-success)',
      backgroundColor: 'var(--el-color-success-light-9)',
      icon: CircleCheckFilled
    },
    [NotificationType.InstructorApplicationApproved]: {
      color: 'var(--capy-success)',
      backgroundColor: 'var(--el-color-success-light-9)',
      icon: SuccessFilled
    },

    // Info / Interaction - Teal
    [NotificationType.QuestionAnswered]: {
      color: 'var(--capy-primary)',
      backgroundColor: 'var(--el-color-primary-light-9)',
      icon: ChatDotRound
    },
    [NotificationType.InstructorReply]: {
      color: 'var(--capy-primary)',
      backgroundColor: 'var(--el-color-primary-light-9)',
      icon: ChatDotRound
    },

    // Announcements - Brown/Beige
    [NotificationType.InstructorAnnouncement]: {
      color: 'var(--capy-brand)',
      backgroundColor: '#F5F0EB',
      icon: Postcard
    },
    [NotificationType.PlatformAnnouncement]: {
      color: 'var(--capy-brand)',
      backgroundColor: '#F5F0EB',
      icon: BellFilled
    },
    [NotificationType.SystemAnnouncement]: {
      color: 'var(--capy-brand)',
      backgroundColor: '#F5F0EB',
      icon: BellFilled
    },

    // Course Updates
    [NotificationType.CourseUpdate]: {
      color: 'var(--capy-primary)',
      backgroundColor: 'var(--el-color-primary-light-9)',
      icon: Reading
    }
  }

  return styleMap[props.notification.notificationType] || {
    color: 'var(--capy-info)',
    backgroundColor: 'var(--el-color-info-light-9)',
    icon: BellFilled
  }
})

// Format notification type for display
const notificationTypeLabel = computed(() => {
  const typeMap = {
    [NotificationType.CourseUpdate]: '課程更新',
    [NotificationType.InstructorReply]: '講師回覆',
    [NotificationType.SystemAnnouncement]: '系統公告',
    [NotificationType.QuestionAnswered]: '問題已回答',
    [NotificationType.PlatformAnnouncement]: '平台公告',
    [NotificationType.InstructorAnnouncement]: '講師公告',
    [NotificationType.AccountSuspended]: '帳號已停用',
    [NotificationType.AccountRestored]: '帳號已恢復',
    [NotificationType.CourseForceUnpublished]: '課程已下架',
    [NotificationType.InstructorApplicationApproved]: '申請已批准',
    [NotificationType.TranscodingFailed]: '轉碼失敗',
    [NotificationType.PayoutFailed]: '付款失敗'
  }
  return typeMap[props.notification.notificationType] || '通知'
})

// Format time
const formattedTime = computed(() => {
  const date = new Date(props.notification.createdAt)
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)

  if (diffInSeconds < 60) return '剛剛'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} 分鐘前`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} 小時前`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} 天前`

  return date.toLocaleDateString('zh-TW')
})

const handleClick = () => {
  emit('click', props.notification)
}
</script>

<style scoped>
.notification-card {
  display: flex;
  gap: var(--capy-spacing-md);
  padding: var(--capy-spacing-lg);
  background: white;
  border: 1px solid var(--capy-border-lighter);
  border-radius: var(--capy-radius-md);
  cursor: pointer;
  transition: all var(--capy-transition-base);
}

.notification-card:hover {
  border-color: var(--capy-border-light);
  box-shadow: var(--capy-shadow-sm);
}

.notification-card.unread {
  background: #FAFBFC;
  border-left: 3px solid var(--capy-primary);
}

/* Notification Icon */
.notification-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: var(--capy-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Notification Content */
.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--capy-spacing-md);
  margin-bottom: var(--capy-spacing-xs);
}

.notification-title {
  font-size: var(--capy-font-size-base);
  font-weight: var(--capy-font-weight-semibold);
  color: var(--capy-text-primary);
  margin: 0;
  line-height: 1.5;
}

.notification-time {
  flex-shrink: 0;
  font-size: var(--capy-font-size-xs);
  color: var(--capy-text-secondary);
  white-space: nowrap;
}

.notification-meta {
  margin-bottom: var(--capy-spacing-xs);
}

.notification-type {
  font-size: var(--capy-font-size-xs);
  color: var(--capy-text-secondary);
}

.notification-message {
  font-size: var(--capy-font-size-sm);
  color: var(--capy-text-regular);
  margin: 0;
  line-height: 1.6;
}

/* Responsive Design */
@media (max-width: 768px) {
  .notification-card {
    padding: var(--capy-spacing-md);
  }

  .notification-icon {
    width: 40px;
    height: 40px;
  }

  .notification-header {
    flex-direction: column;
    gap: var(--capy-spacing-xs);
  }

  .notification-time {
    align-self: flex-start;
  }
}
</style>
