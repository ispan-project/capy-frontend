<template>
  <div class="become-instructor-page">
    <div class="page-header">
      <h1 class="page-title">成為講師</h1>
      <p class="page-subtitle">分享您的專業知識，開啟教學之旅</p>
    </div>

    <InstructorApplicationWizard />
  </div>
</template>

<script setup>
import InstructorApplicationWizard from '@/components/student/BecomeTeacher/InstructorApplicationWizard.vue'
</script>

<style scoped>
.become-instructor-page {
  min-height: 100vh;
  background-color: var(--capy-bg-base);
  padding: var(--capy-spacing-xxl) var(--capy-spacing-lg);
}

.page-header {
  text-align: center;
  margin-bottom: var(--capy-spacing-xxl);
}

.page-title {
  font-size: 36px;
  font-weight: var(--capy-font-weight-bold);
  color: var(--capy-text-primary);
  margin: 0 0 var(--capy-spacing-md) 0;
}

.page-subtitle {
  font-size: var(--capy-font-size-lg);
  color: var(--capy-text-secondary);
  margin: 0;
}

@media (max-width: 768px) {
  .become-instructor-page {
    padding: var(--capy-spacing-lg) var(--capy-spacing-sm);
  }

  .page-title {
    font-size: 28px;
  }

  .page-subtitle {
    font-size: var(--capy-font-size-base);
  }
}
</style>
