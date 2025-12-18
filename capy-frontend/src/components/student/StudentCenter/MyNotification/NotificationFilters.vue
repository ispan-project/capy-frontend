<template>
  <div class="filter-tabs">
    <button
      v-for="tab in tabs"
      :key="tab.value"
      class="filter-tab"
      :class="{ active: modelValue === tab.value }"
      @click="handleTabClick(tab.value)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: 'all'
  }
})

const emit = defineEmits(['update:modelValue'])

const tabs = [
  { label: '全部', value: 'all' },
  { label: '未讀', value: 'unread' },
  { label: '已讀', value: 'read' }
]

const handleTabClick = (value) => {
  emit('update:modelValue', value)
}
</script>

<style scoped>
.filter-tabs {
  display: flex;
  gap: var(--capy-spacing-sm);
  margin-bottom: var(--capy-spacing-lg);
}

.filter-tab {
  padding: var(--capy-spacing-sm) var(--capy-spacing-lg);
  border: none;
  background: transparent;
  color: var(--capy-text-regular);
  font-size: var(--capy-font-size-base);
  font-weight: var(--capy-font-weight-medium);
  cursor: pointer;
  border-radius: var(--capy-radius-base);
  transition: all var(--capy-transition-base);
}

.filter-tab:hover {
  background: var(--capy-bg-elevated);
  color: var(--capy-text-primary);
}

.filter-tab.active {
  background: var(--capy-text-primary);
  color: white;
}
</style>
