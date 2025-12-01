<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import * as echarts from "echarts";

// prettier-ignore
const data = ref( [
  ["2000-06-05", 116], ["2000-06-06", 129], ["2000-06-07", 135], ["2000-06-08", 86], ["2000-06-09", 73], ["2000-06-10", 85], ["2000-06-11", 73], ["2000-06-12", 68], ["2000-06-13", 92], ["2000-06-14", 130], ["2000-06-15", 245], ["2000-06-16", 139], ["2000-06-17", 115], ["2000-06-18", 111], ["2000-06-19", 309], ["2000-06-20", 206], ["2000-06-21", 137], ["2000-06-22", 128], ["2000-06-23", 85], ["2000-06-24", 94], ["2000-06-25", 71], ["2000-06-26", 106], ["2000-06-27", 84], ["2000-06-28", 93], ["2000-06-29", 85], ["2000-06-30", 73], ["2000-07-01", 83], ["2000-07-02", 125], ["2000-07-03", 107], ["2000-07-04", 82], ["2000-07-05", 44], ["2000-07-06", 72], ["2000-07-07", 106], ["2000-07-08", 107], ["2000-07-09", 66], ["2000-07-10", 91], ["2000-07-11", 92], ["2000-07-12", 113], ["2000-07-13", 107], ["2000-07-14", 131], ["2000-07-15", 111], ["2000-07-16", 64], ["2000-07-17", 69], ["2000-07-18", 88], ["2000-07-19", 77], ["2000-07-20", 83], ["2000-07-21", 111], ["2000-07-22", 57], ["2000-07-23", 55], ["2000-07-24", 60]])

const valueList = computed(() => data.value.map((item) => item[1]));
const dateList = computed(() => data.value.map((item) => item[0]));

const gradientLineCharts = ref(null);
const range = ref("all");
const rangeOptions = [
  { label: "全部", value: "all" },
  { label: "近7日", value: "7d" },
  { label: "最近30日", value: "30d" },
  { label: "近半年", value: "180d" },
];

const config = {
  visualMap: { show: false },
  tooltip: { trigger: "axis" },
  xAxis: { data: null },
  yAxis: {},
  grid: {},
  series: {
    type: "line",
    showSymbol: false,
    data: null,
    smooth: true,
    lineStyle: { width: 3 },
    areaStyle: {
      opacity: 0.25,
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: "#409eff" },
        { offset: 1, color: "#66ccff" },
      ]),
    },
    itemStyle: { color: "#409eff" },
    animationDuration: 1500,
    animationEasing: "cubicOut",
  },
  animationDuration: 1200,
  animationEasing: "cubicOut",
};

let resizeObserver;
let chart;

const render = () => {
  config.xAxis.data = dateList.value;
  config.series.data = valueList.value;
  if (chart) {
    chart.clear();
    chart.setOption(config);
  }
};

onMounted(() => {
  chart = echarts.init(gradientLineCharts.value);
  render();

  resizeObserver = new ResizeObserver(() => {
    chart?.resize();
  });
  resizeObserver.observe(gradientLineCharts.value);
});

watch(range, () => {
  // 之後可依 range 過濾資料，目前直接重繪示範
  render();
});

onBeforeUnmount(() => {
  if (resizeObserver) resizeObserver.disconnect();
});
</script>

<template>
  <div class="chart-header">
    <div class="section-title" style="margin-bottom: 0">營收成長趨勢圖</div>
    <el-radio-group v-model="range" size="large">
      <el-radio-button v-for="item in rangeOptions" :key="item.value" :value="item.value">
        {{ item.label }}
      </el-radio-button>
    </el-radio-group>
  </div>
  <div class="chart-wrapper">
    <div class="chart" ref="gradientLineCharts"></div>
  </div>
</template>

<style scoped>
.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.chart {
  width: 100%;
  height: 100%;
}

.chart-wrapper {
  height: 500px;
}
</style>
