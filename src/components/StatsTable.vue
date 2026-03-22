<script setup lang="ts">
import type { PageStats } from '../types/stamp';

interface Props {
  data: Record<string, PageStats>;
}

defineProps<Props>();

function getEntries(data: Record<string, PageStats>): [string, PageStats][] {
  return Object.entries(data);
}
</script>

<template>
  <table class="stats-table">
    <thead class="stats-table__head">
      <tr>
        <th class="stats-table__cell stats-table__cell--header">Page</th>
        <th class="stats-table__cell stats-table__cell--header">Views</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="[page, stats] in getEntries(data)" :key="page">
        <td class="stats-table__cell">{{ page }}</td>
        <td class="stats-table__cell stats-table__cell--number">{{ stats.count }}</td>
      </tr>
    </tbody>
  </table>
  <div v-if="getEntries(data).length === 0" class="stats-table__empty">
    No data available
  </div>
</template>
