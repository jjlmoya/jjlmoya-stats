<script setup lang="ts">
import { onMounted } from 'vue';
import { useStats } from '../composables/useStats';
import StatCard from './StatCard.vue';

const { data, loading, error, fetchStats } = useStats();

function todayRange(): { from: string; to: string } {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return { from: from.toISOString(), to: now.toISOString() };
}

onMounted(() => {
  const { from, to } = todayRange();
  fetchStats({ from, to });
});
</script>

<template>
  <div v-if="loading" class="auth-guard">
    <span class="auth-guard__text">Loading stats...</span>
  </div>
  <div v-else-if="error" class="auth-guard">
    <span class="auth-guard__error">{{ error }}</span>
  </div>
  <div v-else class="grid">
    <StatCard
      v-for="(stats, page) in data"
      :key="page"
      :label="String(page)"
      :value="stats.count"
    />
  </div>
</template>
