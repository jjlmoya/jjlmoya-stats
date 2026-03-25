<script setup lang="ts">
import { computed } from 'vue';
import { useStats } from '../composables/useStats';
import PeriodFilter from './PeriodFilter.vue';
import StatsTable from './StatsTable.vue';
import NoPermission from './NoPermission.vue';
import StatCard from './StatCard.vue';

const { data, loading, error, forbidden, fetchStats } = useStats();

function onPeriodChange(from: string, to: string): void {
  fetchStats({ from, to });
}

const totalPageViews = computed(() => data.value.reduce((acc, r) => acc + r.totalViews, 0));
const totalUniqueViews = computed(() => data.value.reduce((acc, r) => acc + r.uniqueVisits, 0));
const pagesCount = computed(() => data.value.length);
</script>

<template>
  <div class="overview">
    <div class="overview__header">
      <span class="overview__period">Estadísticas</span>
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
        <StatCard label="Páginas vistas" :value="totalPageViews" />
        <StatCard label="Visitas únicas*" :value="totalUniqueViews" />
        <StatCard label="Total páginas" :value="pagesCount" />
      </div>

      <div class="overview__section">
        <span class="overview__section-title">Listado por página</span>
        <div class="overview__table-wrap">
          <StatsTable :data="data" />
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
@import "./StatsPage.css";
</style>


