<script setup lang="ts">
import type { PageStatsResult } from '../types/stamp';

interface Props {
  data: PageStatsResult[];
}

defineProps<Props>();
</script>

<template>
  <div v-if="data.length === 0" class="stats-table__empty">
    No data available
  </div>
  <table v-else class="stats-table">
    <thead class="stats-table__head">
      <tr>
        <th class="stats-table__cell stats-table__cell--header">Page</th>
        <th class="stats-table__cell stats-table__cell--header stats-table__cell--number">Views</th>
        <th class="stats-table__cell stats-table__cell--header stats-table__cell--number">Unique</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in data" :key="row.page" class="stats-table__row">
        <td class="stats-table__cell stats-table__cell--page">{{ row.page }}</td>
        <td class="stats-table__cell stats-table__cell--number">{{ row.totalViews }}</td>
        <td class="stats-table__cell stats-table__cell--number stats-table__cell--muted">{{ row.uniqueVisits }}</td>
      </tr>
    </tbody>
  </table>
</template>
