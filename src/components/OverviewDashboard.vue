<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useStats } from '../composables/useStats';
import StatCard from './StatCard.vue';
import StatsTable from './StatsTable.vue';
import NoPermission from './NoPermission.vue';

interface Period {
  label: string;
  key: string;
}

const PERIODS: Period[] = [
  { label: 'Hoy', key: 'today' },
  { label: '24h', key: '24h' },
  { label: '48h', key: '48h' },
  { label: '7 días', key: '7d' },
  { label: '1 mes', key: '30d' },
  { label: '3 meses', key: '90d' },
];

const { data, loading, error, forbidden, fetchStats } = useStats();
const activePeriod = ref('today');

const totalViews = computed(() => data.value.reduce((s, r) => s + r.totalViews, 0));
const totalUnique = computed(() => data.value.reduce((s, r) => s + r.uniqueVisits, 0));

const activePeriodLabel = computed(() => PERIODS.find((p) => p.key === activePeriod.value)?.label ?? '');

const todayLabel = computed(() =>
  new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }),
);

function rangeForPeriod(key: string): { from: string; to: string } {
  const now = new Date();
  const to = now.toISOString();

  if (key === 'today') {
    const from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return { from: from.toISOString(), to };
  }

  const hours: Record<string, number> = { '24h': 24, '48h': 48, '7d': 168, '30d': 720, '90d': 2160 };
  const h = hours[key] ?? 24;
  const from = new Date(now.getTime() - h * 60 * 60 * 1000);
  return { from: from.toISOString(), to };
}

function selectPeriod(key: string): void {
  activePeriod.value = key;
  const { from, to } = rangeForPeriod(key);
  fetchStats({ from, to });
}

onMounted(() => selectPeriod('today'));
</script>

<template>
  <div v-if="loading" class="auth-guard">
    <span class="auth-guard__text">Cargando stats...</span>
  </div>
  <NoPermission v-else-if="forbidden" />
  <div v-else-if="error" class="auth-guard">
    <span class="auth-guard__error">{{ error }}</span>
  </div>
  <div v-else class="overview">
    <div class="overview__header">
      <span class="overview__period">{{ activePeriodLabel }}</span>
      <span class="overview__date">{{ todayLabel }}</span>
    </div>
    <div class="overview__filters">
      <button
        v-for="p in PERIODS"
        :key="p.key"
        :class="['overview__filter-btn', { 'overview__filter-btn--active': activePeriod === p.key }]"
        @click="selectPeriod(p.key)"
      >
        {{ p.label }}
      </button>
    </div>
    <div class="overview__cards">
      <StatCard label="Visitas totales" :value="totalViews" />
      <StatCard label="Visitas únicas" :value="totalUnique" />
      <StatCard label="Páginas" :value="data.length" />
    </div>
    <div class="overview__section">
      <span class="overview__section-title">Desglose por página</span>
      <div class="overview__table-wrap">
        <StatsTable :data="data" />
      </div>
    </div>
  </div>
</template>
