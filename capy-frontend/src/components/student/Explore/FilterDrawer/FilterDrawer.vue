<template>
  <el-drawer
    v-model="drawerVisible"
    title="Filters"
    direction="ltr"
    size="80%"
    :before-close="handleClose"
  >
    <div class="drawer-content">
      <!-- Category Section -->
      <div class="filter-section">
        <h4 class="section-title-student">Category</h4>
        <CategoryRadioGroup v-model="localCategory" />
      </div>

      <!-- Ratings Section -->
      <div class="filter-section">
        <h4 class="section-title-student">Ratings</h4>
        <RatingOptions v-model="localRating" />
      </div>

      <!-- Apply Button -->
      <div class="drawer-footer">
        <el-button type="primary" size="large" @click="handleApply" class="apply-btn">
          Apply Filters
        </el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import { ref, watch } from 'vue'
import CategoryRadioGroup from './component/CategoryRadioGroup.vue'
import RatingOptions from './component/RatingOptions.vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  selectedCategory: {
    type: String,
    default: 'Information Technology'
  },
  selectedRating: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update:visible', 'update:selectedCategory', 'update:selectedRating'])

const drawerVisible = ref(props.visible)
const localCategory = ref(props.selectedCategory)
const localRating = ref(props.selectedRating)

// 監聽子組件變化並向上傳遞
watch(localCategory, (newVal) => {
  emit('update:selectedCategory', newVal)
})

watch(localRating, (newVal) => {
  emit('update:selectedRating', newVal)
})

const handleClose = () => {
  emit('update:visible', false)
}

const handleApply = () => {
  handleClose()
}

watch(() => props.visible, (newVal) => {
  drawerVisible.value = newVal
})

watch(() => drawerVisible.value, (newVal) => {
  if (!newVal) {
    emit('update:visible', false)
  }
})

watch(() => props.selectedCategory, (newVal) => {
  localCategory.value = newVal
})

watch(() => props.selectedRating, (newVal) => {
  localRating.value = newVal
})
</script>

<style scoped>
.drawer-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.filter-section {
  margin-bottom: 32px;
}

.section-title-student {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 16px 0;
}

.drawer-footer {
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid #e8e8e8;
}

.apply-btn {
  width: 100%;
  background: #7ec8a3;
  border-color: #7ec8a3;
  border-radius: 8px;
  font-weight: 600;
}

.apply-btn:hover {
  background: #6bb890;
  border-color: #6bb890;
}
</style>
