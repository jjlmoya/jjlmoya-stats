<script setup lang="ts">
import { useStats } from '../composables/useStats';
import PeriodFilter from './PeriodFilter.vue';
import StatsTable from './StatsTable.vue';
import NoPermission from './NoPermission.vue';

const { data, loading, error, forbidden, fetchStats } = useStats();

function onPeriodChange(from: string, to: string): void {
  fetchStats({ from, to });
}
</script>

<template>
  <div class="overview">
    <PeriodFilter initial-period="today" @change="onPeriodChange" />
    <div v-if="loading" class="auth-guard">
      <span class="auth-guard__text">Cargando stats...</span>
    </div>
    <NoPermission v-else-if="forbidden" />
    <div v-else-if="error" class="auth-guard">
      <span class="auth-guard__error">{{ error }}</span>
    </div>
    <div v-else class="overview__table-wrap">
      <StatsTable :data="data" />
    </div>
  </div>
</template>
