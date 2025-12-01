<template>
  <div class="instructor-card">
    <h3 class="card-title">Instructor</h3>
    <div class="instructor-info">
      <el-avatar :size="80" :src="instructor.avatar" class="instructor-avatar" />
      <div class="instructor-details">
        <h4 class="instructor-name">{{ instructor.name }}</h4>
        <p class="instructor-title">{{ instructor.title }}</p>
      </div>
    </div>
    <p class="instructor-bio">{{ instructor.bio }}</p>
    <el-button text type="primary" class="view-profile-btn">
      View Profile
    </el-button>
  </div>
</template>

<script setup>
defineProps({
  instructor: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.instructor-card {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
}

.card-title {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 20px 0;
}

.instructor-info {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.instructor-avatar {
  flex-shrink: 0;
}

.instructor-details {
  flex: 1;
}

.instructor-name {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 4px 0;
}

.instructor-title {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.instructor-bio {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0 0 16px 0;
}

.view-profile-btn {
  color: #7ec8a3;
  font-weight: 600;
  padding: 0;
}

.view-profile-btn:hover {
  color: #6bb890;
}
</style>