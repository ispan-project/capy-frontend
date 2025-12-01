<script setup>
import * as echarts from "echarts";

const stackedBarCharts = ref(null);
const range = ref("all");
const rangeOptions = [
  { label: "全部", value: "all" },
  { label: "近7日", value: "7d" },
  { label: "最近30日", value: "30d" },
  { label: "近半年", value: "180d" },
];

const yAxisData = ref(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
const rawSeries = ref([
  {
    name: "Mail Ad",
    data: [120, 132, 101, 134, 90, 230, 210],
  },
]);

const chartSeries = computed(() =>
  rawSeries.value.map((item) => ({
    ...item,
    type: "bar",
    stack: "total",
    label: { show: true },
    emphasis: { focus: "series" },
  }))
);

const config = {
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    },
  },
  legend: {},
  xAxis: {
    type: "value",
  },
  yAxis: {
    type: "category",
  },
  series: null,
};

let resizeObserver;
let chart;

const render = () => {
  config.yAxis.data = yAxisData.value;
  config.series = chartSeries.value;
  if (chart) {
    chart.setOption(config);
  }
};

onMounted(() => {
  chart = echarts.init(stackedBarCharts.value);
  render();

  resizeObserver = new ResizeObserver(() => {
    chart?.resize();
  });
  resizeObserver.observe(stackedBarCharts.value);
});

watch(range, () => {
  // 後續可依 range 過濾資料，目前示範直接重繪
  render();
});

onBeforeUnmount(() => {
  if (resizeObserver) resizeObserver.disconnect();
});
</script>

<template>
  <div class="chart-header">
    <div class="section-title" style="margin-bottom: 0">各分類課程上架數</div>
    <el-radio-group v-model="range" size="large">
      <el-radio-button v-for="item in rangeOptions" :key="item.value" :value="item.value">
        {{ item.label }}
      </el-radio-button>
    </el-radio-group>
  </div>
  <div class="chart-wrapper">
    <div class="chart" ref="stackedBarCharts"></div>
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
