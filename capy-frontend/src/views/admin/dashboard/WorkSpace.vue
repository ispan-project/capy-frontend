<script setup>
import GradientLineChart from "@/components/admin/GradientLineChart.vue";

const progressBarColor = ["#409eff", "#67c23a", "#e6a23c", "#f56c6c", "#909399"];
const data = ref([
  { id: 1, name: "UI/UX設計入門", num: 1985 },
  { id: 2, name: "UI/UX設計入門2", num: 1543 },
  { id: 3, name: "UI/UX設計入門2", num: 1543 },
  { id: 4, name: "UI/UX設計入門2", num: 1543 },
  { id: 5, name: "UI/UX設計入門2", num: 1543 },
]);

const datalist = computed(() => {
  const total = data.value?.reduce((sum, item) => sum + item.num, 0) || 1;
  return data.value?.map((item, index) => ({
    ...item,
    value: Math.ceil((item.num / total) * 100),
    color: progressBarColor[index] || "#ccc",
  }));
});
</script>
<template>
  <h2 class="section-heading">管理員工作台</h2>
  <div style="padding-top: 24px; display: flex; flex-direction: column; gap: 36px">
    <div>
      <h3 class="section-title">課程資訊</h3>
      <el-row :gutter="20">
        <el-col :span="6"
          ><div class="data-wrapper">
            <span>今日新註冊用戶</span><span class="data">1234</span>
          </div></el-col
        >
        <el-col :span="6"
          ><div class="data-wrapper">待審核上架申請<span class="data undone">12</span></div></el-col
        >
        <el-col :span="6"
          ><div class="data-wrapper">待審核教師申請<span class="data">8</span></div></el-col
        >
        <el-col :span="6"
          ><div class="data-wrapper">
            本月收益
            <span class="data"><el-text class="data" truncated>NT$85300</el-text></span>
          </div></el-col
        >
      </el-row>
    </div>

    <div>
      <h3 class="section-title">平台數據一覽</h3>
      <el-row :gutter="20">
        <el-col :span="14">
          <div class="wrapper">
            <p style="font-size: 20px; color: rgb(84, 80, 80); display: flex">
              本月學生人數成長<span style="margin-left: auto; font-weight: 700">56人</span>
            </p>
            <div class="chart-container"><LineCharts></LineCharts></div></div
        ></el-col>
        <el-col :span="10">
          <div class="wrapper">
            <p style="font-size: 20px; color: rgb(84, 80, 80)">熱門課程Top5</p>

            <ul class="top-course-list">
              <li v-for="item in datalist" :key="item.id">
                <div class="top-course-label">
                  {{ item.name }}<el-button link type="primary">查看</el-button>
                </div>
                <p style="font-size: 14px; font-weight: 500; margin-bottom: 4px">
                  {{ item.num }}人
                </p>
                <el-progress :color="item.color" :show-text="false" :percentage="item.value" />
              </li>
            </ul></div
        ></el-col>
      </el-row>
    </div>
    <div>
      <div class="wrapper">
        <GradientLineChart />
      </div>
    </div>
  </div>
</template>
<style scoped>
.data-wrapper {
  height: fit-content;
  font-size: 16px;
  color: rgb(84, 80, 80);
  background-color: #fcfcfd;
  box-shadow: 0 0 8px #0000001f;
  padding: 24px;
  border-radius: 16px;
}
.data {
  margin-top: 24px;
  font-weight: 700;
  font-size: 24px;
  display: block;
}
.undone {
  position: relative;
}
.undone::after {
  content: "";
  margin-left: 4px;
  position: absolute;

  top: -12%;
  border-radius: 50%;
  width: 8px;
  height: 8px;
  background-color: red;
}
.chart-container {
  height: 500px;
  width: 100%;
}
.top-course-list {
  padding-top: 36px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.top-course-label {
  padding-right: 2%;
  margin-bottom: 8px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
}
</style>
