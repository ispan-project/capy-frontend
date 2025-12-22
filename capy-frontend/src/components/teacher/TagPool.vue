<script setup>
import { CircleClose, CirclePlus } from "@element-plus/icons-vue";
const props = defineProps({
  optionList: {
    required: true,
    type: Array,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: Array,
  },
});
const emits = defineEmits(["update:modelValue"]);

const defaultList = props.optionList?.map((item) => ({ ...item, active: false }));
defaultList.forEach((item) => {
  if (props.modelValue?.includes(item.id)) {
    item.active = true;
  }
});

const tagPoolList = ref(defaultList);

const activeList = computed(() => tagPoolList.value?.filter((item) => item.active));
const activeValue = computed(() => activeList.value?.map((item) => item.id));
const inActiveList = computed(() => tagPoolList.value?.filter((item) => !item.active));
const becomeActive = (id) => {
  if (activeList.value.length >= 10) {
    ElMessage.error("已達標籤數量上限");
    return;
  }
  tagPoolList.value.find((item) => item.id === id).active = true;
  emits("update:modelValue", activeValue.value);
};
const becomeInActive = (id) => {
  tagPoolList.value.find((item) => item.id === id).active = false;
};
// defineExpose({ activeList: activeList.value });
</script>
<template>
  <div>
    <div>
      <div class="tagpool">
        <span class="tag" @click="becomeInActive(item.id)" v-for="item in activeList" :key="item.id"
          ><el-icon style="margin-right: 8px"><CircleClose /></el-icon>{{ item.name }}</span
        >
      </div>
      <p class="tip-text">已選擇({{ activeList?.length }}/3)</p>
    </div>
    <p style="margin-bottom: 8px; color: #606266; line-height: 1">所有標籤 :</p>
    <div class="tagpool">
      <span class="tag" @click="becomeActive(item.id)" v-for="item in inActiveList" :key="item.id"
        ><el-icon style="margin-right: 8px"><CirclePlus /></el-icon>{{ item.name }}</span
      >
    </div>
  </div>
</template>
<style scoped>
.tagpool {
  width: 100%;
  display: flex;
  align-items: flex-start;
  border-radius: 4px;
  background-color: #fff;
  border: 1px solid #dcdfe6;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px 12px;
  min-height: 36px;
}
.tag {
  line-height: 1.5;
  padding: 2px 4px;
  display: flex;
  align-items: center;
  color: #fff;
  /* border: 1px solid #000; */
  background-color: #409eef;
  border-radius: 4px;
  font-weight: 500;
}
.tag:hover {
  cursor: pointer;
  background-color: #f0f3f5;
  color: #409eef;
}
.tip-text {
  text-align: right;
  line-height: 1.5;
  font-size: 14px;
  color: #606266;
}
</style>
