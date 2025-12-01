<template>
  <div class="category-menu-wrapper">
    <el-menu
      :default-active="activeMenuItem"
      class="category-menu"
      @select="handleMenuSelect"
    >
      <el-sub-menu index="it">
        <template #title>
          <span>Information Technology</span>
        </template>
        <el-menu-item index="it">All IT Courses</el-menu-item>
        <el-menu-item index="it-java">Java</el-menu-item>
        <el-menu-item index="it-python">Python</el-menu-item>
        <el-menu-item index="it-web">Web Development</el-menu-item>
        <el-menu-item index="it-data">Data Science</el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="business">
        <template #title>
          <span>Business</span>
        </template>
        <el-menu-item index="business">All Business Courses</el-menu-item>
        <el-menu-item index="business-marketing">Marketing</el-menu-item>
        <el-menu-item index="business-finance">Finance</el-menu-item>
        <el-menu-item index="business-entrepreneurship">Entrepreneurship</el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="design">
        <template #title>
          <span>Design</span>
        </template>
        <el-menu-item index="design">All Design Courses</el-menu-item>
        <el-menu-item index="design-uiux">UI/UX</el-menu-item>
        <el-menu-item index="design-graphic">Graphic Design</el-menu-item>
      </el-sub-menu>
    </el-menu>

    <!-- 示意：顯示 parent / child （純顯示用） -->
    <div class="category-info">
      <div>Parent: {{ selectedParent || 'none' }}</div>
      <div>Child: {{ selectedChild || 'none' }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  modelValue: {
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

// Menu 狀態
const activeMenuItem = ref('it')

// Menu 選擇處理
const handleMenuSelect = (index) => {
  activeMenuItem.value = index
  
  // 解析 index 來得到 parent 和 child
  const parts = index.split('-')
  const parent = parts[0]
  const child = parts.length > 1 ? parts.slice(1).join('-') : null
  
  // 轉換成陣列格式發送
  const value = child ? [parent, child] : [parent]
  emit('update:modelValue', value)
}

// Computed: 取得選中的父類別
const selectedParent = computed(() => {
  if (!activeMenuItem.value) {
    return null
  }
  const parts = activeMenuItem.value.split('-')
  return parts[0]
})

// Computed: 取得選中的子類別（如果有）
const selectedChild = computed(() => {
  if (!activeMenuItem.value) {
    return null
  }
  const parts = activeMenuItem.value.split('-')
  return parts.length > 1 ? parts.slice(1).join('-') : null
})

// 監聽 props 變化同步到內部狀態
watch(() => props.modelValue, (newVal) => {
  if (newVal && newVal.length > 0) {
    // 將陣列格式轉換回 menu index 格式
    const parent = newVal[0]
    const child = newVal.length > 1 ? newVal[1] : null
    activeMenuItem.value = child ? `${parent}-${child}` : parent
  }
})
</script>

<style scoped>
.category-menu-wrapper {
  width: 100%;
}

.category-menu {
  border: none;
  background: transparent;
}

.category-menu :deep(.el-sub-menu__title) {
  height: 48px;
  line-height: 48px;
  padding-left: 12px !important;
  font-weight: 600;
  color: #2c3e50;
}

.category-menu :deep(.el-menu-item) {
  height: 40px;
  line-height: 40px;
  padding-left: 32px !important;
  color: #606266;
}

.category-menu :deep(.el-menu-item:hover) {
  background: #f5f5f5;
}

.category-menu :deep(.el-menu-item.is-active) {
  background: #f0f9f4;
  color: #7ec8a3;
  font-weight: 600;
}

.category-info {
  margin-top: 16px;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 8px;
  font-size: 12px;
  color: #909399;
}

.category-info div {
  line-height: 1.8;
}
</style>