<script setup lang="ts">
import { onMounted } from 'vue';
import { useStats } from '../composables/useStats';
import StatsFilter from './StatsFilter.vue';
import StatsTable from './StatsTable.vue';
import NoPermission from './NoPermission.vue';

const { data, loading, error, forbidden, fetchStats } = useStats();

function handleFilter(from: string, to: string): void {
  fetchStats({ from, to });
}

onMounted(() => {
  const now = new Date();
  const week = new Date(now);
  week.setDate(week.getDate() - 7);
  fetchStats({ from: week.toISOString(), to: now.toISOString() });
});
</script>

<template>
  <StatsFilter @filter="handleFilter" />
  <div v-if="loading" class="auth-guard">
    <span class="auth-guard__text">Loading stats...</span>
  </div>
  <NoPermission v-else-if="forbidden" />
  <div v-else-if="error" class="auth-guard">
    <span class="auth-guard__error">{{ error }}</span>
  </div>
  <StatsTable v-else :data="data" />
</template>
