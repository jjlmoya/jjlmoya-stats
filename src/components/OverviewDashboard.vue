<script setup lang="ts">
import { ref, computed } from 'vue';
import { useStats } from '../composables/useStats';
import StatCard from './StatCard.vue';
import PeriodFilter from './PeriodFilter.vue';
import ProgressBar from './ProgressBar.vue';
import NoPermission from './NoPermission.vue';

const { data, loading, error, forbidden, fetchStats } = useStats();
const periodLabel = ref('Hoy');

const totalViews = computed(() => data.value.reduce((s, r) => s + r.totalViews, 0));
const totalUnique = computed(() => data.value.reduce((s, r) => s + r.uniqueVisits, 0));

const topPages = computed(() =>
  [...data.value].sort((a, b) => b.totalViews - a.totalViews).slice(0, 8),
);

const maxViews = computed(() => topPages.value[0]?.totalViews ?? 1);

const todayLabel = computed(() =>
  new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }),
);

function onPeriodChange(from: string, to: string, label: string): void {
  periodLabel.value = label;
  fetchStats({ from, to });
}
</script>

<template>
  <div class="overview">
    <div class="overview__header">
      <span class="overview__period">{{ periodLabel }}</span>
      <span class="overview__date">{{ todayLabel }}</span>
    </div>
    <PeriodFilter initial-period="today" @change="onPeriodChange" />
    <div v-if="loading" class="auth-guard">
      <span class="auth-guard__text">Cargando stats...</span>
    </div>
    <NoPermission v-else-if="forbidden" />
    <div v-else-if="error" class="auth-guard">
      <span class="auth-guard__error">{{ error }}</span>
    </div>
    <template v-else>
      <div class="overview__cards">
        <StatCard label="Visitas totales" :value="totalViews" />
        <StatCard label="Visitas únicas" :value="totalUnique" />
        <StatCard label="Páginas activas" :value="data.length" />
      </div>
      <div v-if="topPages.length > 0" class="overview__section">
        <span class="overview__section-title">Top páginas</span>
        <div class="overview__top">
          <div v-for="(page, i) in topPages" :key="page.page" class="overview__top-item">
            <span class="overview__top-rank">{{ i + 1 }}</span>
            <div class="overview__top-info">
              <div class="overview__top-meta">
                <span class="overview__top-page">{{ page.page }}</span>
                <span class="overview__top-count">{{ page.totalViews }}</span>
              </div>
              <ProgressBar :pct="Math.round((page.totalViews / maxViews) * 100)" />
            </div>
          </div>
        </div>
      </div>
      <div v-else class="overview__empty">
        Sin datos para este periodo
      </div>
    </template>
  </div>
</template>
