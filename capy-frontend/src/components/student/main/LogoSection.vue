<template>
  <div class="logo">
    <span class="logo-icon">🦫</span>
    <span class="logo-text">CapyCourse</span>
  </div>
</template>

<script setup>
// Logo 組件 - 顯示網站標誌
</script>

<style scoped>
.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 24px;
  font-weight: 700;
  color: #2c3e50;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
}

.logo-icon {
  font-size: 32px;
}

.logo-text {
  font-family: 'Arial', sans-serif;
}

/* RWD */
@media (max-width: 768px) {
  .logo-text {
    display: none;
  }
}
</style>