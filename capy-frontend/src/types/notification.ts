/**
 * 通知類型枚舉
 */
export enum NotificationType {
  // Interaction - 互動類型
  QuestionAnswered = 'question_answered',

  // Announcements - 公告類型
  PlatformAnnouncement = 'platform_announcement',
  InstructorAnnouncement = 'instructor_announcement',
  SystemAnnouncement = 'system_announcement',

  // Account / Critical - 帳號/重要通知
  AccountSuspended = 'account_suspended',
  AccountRestored = 'account_restored',
  CourseForceUnpublished = 'course_force_unpublished',

  // Course Updates - 課程更新
  CourseUpdate = 'course_update',
  InstructorReply = 'instructor_reply',

  // Instructor - 講師相關
  InstructorApplicationApproved = 'instructor_application_approved',

  // System Errors - 系統錯誤
  TranscodingFailed = 'transcoding_failed',
  PayoutFailed = 'payout_failed'
}

/**
 * 通知介面
 */
export interface Notification {
  id: number;
  title: string;
  content: string;
  notificationType: NotificationType;
  isRead: boolean; // 0 or 1 in DB
  createdAt: string; // ISO string
  relatedEntityType?: string; // 'course', 'question', etc.
  relatedEntityId?: number;
}

/**
 * 通知樣式配置
 */
export interface NotificationStyle {
  color: string;
  backgroundColor: string;
  icon: any; // Element Plus Icon Component
}
