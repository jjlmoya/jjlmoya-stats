<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import type { TimeSeriesPoint } from '../types/stamp';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

interface Props {
  data: TimeSeriesPoint[];
  loading: boolean;
}

const props = defineProps<Props>();

function getCssVar(name: string): string {
  return window.getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function buildDataset(label: string, values: number[], color: string) {
  return {
    label,
    data: values,
    borderColor: color,
    backgroundColor: color + '20',
    fill: true,
    tension: 0.4,
    pointRadius: 3,
  };
}

function buildChartData(points: TimeSeriesPoint[]) {
  const accent = getCssVar('--color-accent');
  const success = getCssVar('--color-success');
  return {
    labels: points.map((p) => p.date),
    datasets: [
      buildDataset('Vistas totales', points.map((p) => p.totalViews), accent),
      buildDataset('Visitas únicas', points.map((p) => p.uniqueVisits), success),
    ],
  };
}

function buildScale(textMuted: string, border: string) {
  return { ticks: { color: textMuted }, grid: { color: border } };
}

function buildYScale(textMuted: string, border: string) {
  return { ticks: { color: textMuted }, grid: { color: border }, beginAtZero: true };
}

function buildChartOptions() {
  const textMuted = getCssVar('--color-text-muted');
  const border = getCssVar('--color-border');
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: textMuted } } },
    scales: {
      x: buildScale(textMuted, border),
      y: buildYScale(textMuted, border),
    },
  };
}

const chartData = ref(buildChartData([]));
const chartOptions = ref(buildChartOptions());

function refresh(points: TimeSeriesPoint[]) {
  chartData.value = buildChartData(points);
  chartOptions.value = buildChartOptions();
}

watch(() => props.data, refresh);
onMounted(() => refresh(props.data));
</script>

<template>
  <div class="page-chart">
    <div v-if="loading" class="page-chart__state">
      <span class="page-chart__state-text">Cargando...</span>
    </div>
    <div v-else-if="!data.length" class="page-chart__state">
      <span class="page-chart__state-text">Sin datos para este período</span>
    </div>
    <div v-else class="page-chart__canvas">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<style scoped>
@import "./PageEvolutionChart.css";
</style>
