<script setup>
import { ref } from 'vue'

const stats = ref([
  {
    id: 1,
    icon: '👥',
    number: '10,000+',
    label: '活躍學員'
  },
  {
    id: 2,
    icon: '📚',
    number: '500+',
    label: '精選課程'
  },
  {
    id: 3,
    icon: '🎓',
    number: '100+',
    label: '專業講師'
  },
  {
    id: 4,
    icon: '⭐',
    number: '4.8',
    label: '平均評分'
  }
])
</script>

<template>
  <div class="trust-bar">
    <div class="trust-bar-container">
      <div
        v-for="stat in stats"
        :key="stat.id"
        class="stat-item"
      >
        <div class="stat-icon">{{ stat.icon }}</div>
        <div class="stat-number">{{ stat.number }}</div>
        <div class="stat-label">{{ stat.label }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.trust-bar {
  background-color: var(--capy-bg-surface);
  padding: var(--capy-spacing-xxl) var(--capy-spacing-lg);
  box-shadow: var(--capy-shadow-sm);
}

.trust-bar-container {
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--capy-spacing-xl);
}

.stat-item {
  text-align: center;
  padding: var(--capy-spacing-md);
  transition: transform var(--capy-transition-base);
}

.stat-item:hover {
  transform: translateY(-4px);
}

.stat-icon {
  font-size: 48px;
  margin-bottom: var(--capy-spacing-sm);
  filter: grayscale(0.2);
}

.stat-number {
  font-size: var(--capy-font-size-xxl);
  font-weight: var(--capy-font-weight-bold);
  color: var(--capy-primary);
  margin-bottom: var(--capy-spacing-xs);
  line-height: 1.2;
}

.stat-label {
  font-size: var(--capy-font-size-base);
  color: var(--capy-text-secondary);
  font-weight: var(--capy-font-weight-medium);
}

@media (max-width: 768px) {
  .trust-bar {
    padding: var(--capy-spacing-lg) var(--capy-spacing-md);
  }

  .trust-bar-container {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--capy-spacing-lg);
  }

  .stat-icon {
    font-size: 36px;
  }

  .stat-number {
    font-size: var(--capy-font-size-xl);
  }

  .stat-label {
    font-size: var(--capy-font-size-sm);
  }
}

@media (max-width: 480px) {
  .trust-bar-container {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--capy-spacing-md);
  }
}
</style>
