<template>
  <div class="category-radio-wrapper">
    <el-radio-group v-model="localCategory" class="category-group" @change="handleCategoryChange">
      <el-radio 
        v-for="cat in categories" 
        :key="cat" 
        :value="cat"
        class="category-radio"
      >
        {{ cat }}
      </el-radio>
    </el-radio-group>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: 'Information Technology'
  }
})

const emit = defineEmits(['update:modelValue'])

const localCategory = ref(props.modelValue)

const categories = [
  'Information Technology',
  'Business',
  'Design',
  'Marketing',
  'Personal Development',
  'Health & Fitness',
  'Music'
]

const handleCategoryChange = (value) => {
  emit('update:modelValue', value)
}

watch(() => props.modelValue, (newVal) => {
  localCategory.value = newVal
})
</script>

<style scoped>
.category-radio-wrapper {
  width: 100%;
}

.category-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.category-radio {
  height: auto;
  margin: 0;
  padding: 14px;
  border-radius: 8px;
  transition: all 0.3s;
  border: 1px solid #e8e8e8;
}

.category-radio:hover {
  background: #f5f5f5;
}

.category-radio :deep(.el-radio__label) {
  color: #606266;
  font-size: 15px;
  padding-left: 8px;
}

.category-radio :deep(.el-radio__input.is-checked + .el-radio__label) {
  color: #7ec8a3;
  font-weight: 600;
}

.category-radio :deep(.el-radio__input.is-checked .el-radio__inner) {
  background: #7ec8a3;
  border-color: #7ec8a3;
}
</style>