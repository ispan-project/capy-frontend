<script setup>
import OderRecordTable from "./OderRecordTable.vue";
</script>
<template>
  <h2 class="section-heading">數據統計</h2>
  <div class="chart-container">
    <div class="wrapper">
      <GradientLineChart />
    </div>
    <el-row :gutter="24">
      <el-col :span="11">
        <div class="wrapper">
          <div class="section-title">各分類課程營收占比</div>
          <div style="height: 300px">
            <PieCharts />
          </div>
        </div>
      </el-col>
      <el-col :span="13">
        <div class="wrapper">
          <div class="section-title">使用者成長趨勢圖</div>
          <div style="height: 300px">
            <LineCharts />
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="wrapper">
      <StackedBarChart />
    </div>
    <OderRecordTable />
  </div>
</template>
<style scoped>
.chart-container {
  display: flex;
  flex-direction: column;
  gap: 48px;
}
</style>
