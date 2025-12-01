<template>
  <div class="notifications-page">
    <!-- Header -->
    <div class="page-header">
      <h1 class="page-title">My Notifications</h1>
    </div>

    <!-- Filter Tabs -->
    <NotificationFilters v-model="activeFilter" />

    <!-- Search Bar -->
    <NotificationSearchBar v-model="searchQuery" />

    <!-- Notifications List -->
    <div class="notifications-list">
      <NotificationCard
        v-for="notification in paginatedNotifications"
        :key="notification.id"
        :notification="notification"
        @click="handleNotificationClick"
      />

      <!-- Empty State -->
      <div v-if="filteredNotifications.length === 0" class="empty-state">
        <el-icon :size="64" color="#C0C4CC">
          <BellFilled />
        </el-icon>
        <p class="empty-text">No notifications found</p>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="filteredNotifications.length > pageSize" class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="filteredNotifications.length"
        :pager-count="5"
        layout="prev, pager, next"
        background
        size="small"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { BellFilled } from '@element-plus/icons-vue'
import { NotificationType } from '@/types/notification'
import NotificationCard from '@/components/student/StudentCenter/MyNotification/NotificationCard.vue'
import NotificationFilters from '@/components/student/StudentCenter/MyNotification/NotificationFilters.vue'
import NotificationSearchBar from '@/components/student/StudentCenter/MyNotification/NotificationSearchBar.vue'

// State
const activeFilter = ref('all')
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(5)

// Mock notifications data
const notifications = ref([
  {
    id: 1,
    title: 'Course Update',
    content: 'Your course "Introduction to Data Science" has been updated with new materials.',
    notificationType: NotificationType.CourseUpdate,
    isRead: false,
    createdAt: '2023-10-25T08:30:00Z',
    relatedEntityType: 'course',
    relatedEntityId: 101
  },
  {
    id: 2,
    title: 'Instructor Reply',
    content: 'Instructor Sarah Chen has replied to your question in the "Advanced Calculus" forum.',
    notificationType: NotificationType.InstructorReply,
    isRead: false,
    createdAt: '2023-10-25T07:45:00Z',
    relatedEntityType: 'question',
    relatedEntityId: 205
  },
  {
    id: 3,
    title: 'System Announcement',
    content: 'Welcome to CapyCourse! Explore our platform and start learning today.',
    notificationType: NotificationType.SystemAnnouncement,
    isRead: false,
    createdAt: '2023-10-24T15:00:00Z'
  },
  {
    id: 4,
    title: 'Course Update',
    content: 'Your course "Introduction to Data Science" has been updated with new materials.',
    notificationType: NotificationType.CourseUpdate,
    isRead: true,
    createdAt: '2023-10-23T10:30:00Z',
    relatedEntityType: 'course',
    relatedEntityId: 101
  },
  {
    id: 5,
    title: 'Instructor Reply',
    content: 'Instructor Sarah Chen has replied to your question in the "Advanced Calculus" forum.',
    notificationType: NotificationType.InstructorReply,
    isRead: true,
    createdAt: '2023-10-22T14:20:00Z',
    relatedEntityType: 'question',
    relatedEntityId: 206
  },
  {
    id: 6,
    title: 'System Announcement',
    content: 'Welcome to CapyCourse! Explore our platform and start learning today.',
    notificationType: NotificationType.SystemAnnouncement,
    isRead: true,
    createdAt: '2023-10-21T09:00:00Z'
  },
  {
    id: 7,
    title: 'Your account has been restored',
    content: 'Thank you for contacting support. Your access is fully restored.',
    notificationType: NotificationType.AccountRestored,
    isRead: false,
    createdAt: '2023-10-20T16:30:00Z'
  },
  {
    id: 8,
    title: 'Account Suspended',
    content: 'Your account has been temporarily suspended due to policy violation. Please contact support.',
    notificationType: NotificationType.AccountSuspended,
    isRead: true,
    createdAt: '2023-10-19T11:00:00Z'
  }
])

// Filter notifications
const filteredNotifications = computed(() => {
  let filtered = notifications.value

  // Apply read/unread filter
  if (activeFilter.value === 'unread') {
    filtered = filtered.filter(n => !n.isRead)
  } else if (activeFilter.value === 'read') {
    filtered = filtered.filter(n => n.isRead)
  }

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(n =>
      n.title.toLowerCase().includes(query) ||
      n.content.toLowerCase().includes(query)
    )
  }

  return filtered
})

// Paginated notifications
const paginatedNotifications = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredNotifications.value.slice(start, end)
})

// Handle notification click
const handleNotificationClick = (notification) => {
  // Mark as read
  notification.isRead = true

  // Navigate to related entity if exists
  if (notification.relatedEntityType && notification.relatedEntityId) {
    console.log(`Navigate to ${notification.relatedEntityType}:${notification.relatedEntityId}`)
  }
}
</script>

<style scoped>
.notifications-page {
  padding: 0;
}

/* Header */
.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 14px;
  color: #666;
  margin: 0;
}

/* Notifications List */
.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-text {
  font-size: 16px;
  color: #999;
  margin-top: 16px;
}

/* Pagination */
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.pagination-container :deep(.el-pagination) {
  gap: 8px;
}

.pagination-container :deep(.el-pagination button),
.pagination-container :deep(.el-pager li) {
  min-width: 36px;
  height: 36px;
  line-height: 36px;
  border-radius: 6px;
  font-weight: 500;
}

.pagination-container :deep(.el-pager li.is-active) {
  background: #1a1a1a;
  color: white;
}

.pagination-container :deep(.el-pager li:hover) {
  color: #4CAF50;
}

/* Responsive Design */
@media (max-width: 768px) {
  .page-title {
    font-size: 22px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 20px;
  }
}
</style>
