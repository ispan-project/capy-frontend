<template>
  <div class="search-container">
    <el-input
      :model-value="modelValue"
      @update:model-value="handleInput"
      placeholder="Search notifications..."
      class="search-input"
      clearable
    >
      <template #prefix>
        <el-icon><Search /></el-icon>
      </template>
    </el-input>
  </div>
</template>

<script setup>
import { Search } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const handleInput = (value) => {
  emit('update:modelValue', value)
}
</script>

<style scoped>
.search-container {
  margin-bottom: var(--capy-spacing-lg);
}

.search-input {
  width: 100%;
}

.search-input :deep(.el-input__wrapper) {
  background: var(--capy-bg-elevated);
  border-radius: var(--capy-radius-md);
  padding: var(--capy-spacing-sm) var(--capy-spacing-md);
}
</style>