<script setup lang="ts">
import { ref, computed } from 'vue';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-vue-next';
import type { PageStatsResult } from '../types/stamp';

type SortKey = 'page' | 'totalViews' | 'uniqueVisits';
type SortDir = 'asc' | 'desc';

interface Props {
  data: PageStatsResult[];
}

const props = defineProps<Props>();

const sortKey = ref<SortKey>('totalViews');
const sortDir = ref<SortDir>('desc');

const sortedData = computed(() => {
  const dir = sortDir.value === 'asc' ? 1 : -1;
  return [...props.data].sort((a, b) => {
    const av = a[sortKey.value];
    const bv = b[sortKey.value];
    if (typeof av === 'string') return dir * av.localeCompare(bv as string);
    return dir * ((av as number) - (bv as number));
  });
});

function sort(key: SortKey): void {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortDir.value = key === 'page' ? 'asc' : 'desc';
  }
}
</script>

<template>
  <div v-if="data.length === 0" class="stats-table__empty">
    Sin datos para este periodo
  </div>
  <table v-else class="stats-table">
    <thead class="stats-table__head">
      <tr>
        <th
          class="stats-table__cell stats-table__cell--header stats-table__cell--sortable"
          :class="{ 'stats-table__cell--sorted': sortKey === 'page' }"
          @click="sort('page')"
        >
          <span class="stats-table__head-content">
            Página
            <ChevronUp v-if="sortKey === 'page' && sortDir === 'asc'" :size="12" />
            <ChevronDown v-else-if="sortKey === 'page' && sortDir === 'desc'" :size="12" />
            <ChevronsUpDown v-else :size="12" class="stats-table__sort-idle" />
          </span>
        </th>
        <th
          class="stats-table__cell stats-table__cell--header stats-table__cell--number stats-table__cell--sortable"
          :class="{ 'stats-table__cell--sorted': sortKey === 'totalViews' }"
          @click="sort('totalViews')"
        >
          <span class="stats-table__head-content stats-table__head-content--right">
            <ChevronUp v-if="sortKey === 'totalViews' && sortDir === 'asc'" :size="12" />
            <ChevronDown v-else-if="sortKey === 'totalViews' && sortDir === 'desc'" :size="12" />
            <ChevronsUpDown v-else :size="12" class="stats-table__sort-idle" />
            Visitas
          </span>
        </th>
        <th
          class="stats-table__cell stats-table__cell--header stats-table__cell--number stats-table__cell--sortable"
          :class="{ 'stats-table__cell--sorted': sortKey === 'uniqueVisits' }"
          @click="sort('uniqueVisits')"
        >
          <span class="stats-table__head-content stats-table__head-content--right">
            <ChevronUp v-if="sortKey === 'uniqueVisits' && sortDir === 'asc'" :size="12" />
            <ChevronDown v-else-if="sortKey === 'uniqueVisits' && sortDir === 'desc'" :size="12" />
            <ChevronsUpDown v-else :size="12" class="stats-table__sort-idle" />
            Únicas
          </span>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in sortedData" :key="row.page" class="stats-table__row">
        <td class="stats-table__cell stats-table__cell--page">{{ row.page }}</td>
        <td class="stats-table__cell stats-table__cell--number">{{ row.totalViews }}</td>
        <td class="stats-table__cell stats-table__cell--number stats-table__cell--muted">{{ row.uniqueVisits }}</td>
      </tr>
    </tbody>
  </table>
</template>
