<script setup lang="ts">
import { ref, computed } from 'vue';
import { X, ChevronDown, ChevronRight, ChevronUp } from 'lucide-vue-next';
import { getFlow } from '../api/stamp';
import type { VisitSummary, PageView } from '../types/stamp';
import VisitFlow from './VisitFlow.vue';

const props = defineProps<{
  visits: VisitSummary[];
  loading: boolean;
}>();

const search = ref('');
const expandedId = ref<string | null>(null);
const flowViews = ref<Record<string, PageView[]>>({});
const loadingFlows = ref<Record<string, boolean>>({});
const sortBy = ref<keyof VisitSummary>('startedAt');
const sortOrder = ref<'asc' | 'desc'>('desc');

function sortCmp(a: VisitSummary, b: VisitSummary) {
  const valA = a[sortBy.value];
  const valB = b[sortBy.value];
  
  if (typeof valA === 'string' && typeof valB === 'string') {
    return sortOrder.value === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
  }
  
  return sortOrder.value === 'asc' ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
}

const processedVisits = computed(() => {
  const q = search.value.trim().toLowerCase();
  let result = q 
    ? props.visits.filter(v => v.visitId.toLowerCase().includes(q) || v.firstPage.toLowerCase().includes(q))
    : [...props.visits];
  return result.sort(sortCmp);
});

function toggleSort(key: keyof VisitSummary) {
  if (sortBy.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = key;
    sortOrder.value = 'asc';
  }
}

async function toggleRow(visitId: string) {
  if (expandedId.value === visitId) {
    expandedId.value = null;
    return;
  }
  expandedId.value = visitId;
  if (!flowViews.value[visitId]) {
    loadingFlows.value[visitId] = true;
    try {
      const res = await getFlow(visitId);
      flowViews.value[visitId] = res.data;
    } catch { /* Suppress */ }
    loadingFlows.value[visitId] = false;
  }
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleString('es-ES', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

function getDayParityClass(dateStr: string): string {
  const date = new Date(dateStr);
  return date.getDate() % 2 === 0 ? 'visit-table__row--even' : 'visit-table__row--odd';
}
</script>

<template>
  <div class="stats-table__wrapper">
    <div class="stats-table__search">
      <input
        v-model="search"
        class="stats-table__search-input"
        type="text"
        placeholder="Buscar por ID de visita o página..."
      />
      <button v-if="search" class="stats-table__search-clear" @click="search = ''">
        <X :size="14" />
      </button>
    </div>

    <div v-if="loading" class="stats-table__empty">Cargando visitas...</div>
    <div v-else-if="processedVisits.length === 0" class="stats-table__empty">Sin resultados</div>
    <table v-else class="stats-table">
      <thead class="stats-table__head">
        <tr>
          <th class="stats-table__cell stats-table__cell--header visit-table--expander-col" />
          <th v-for="h in [{k: 'startedAt', l: 'Actividad'}, {k: 'visitId', l: 'ID'}, {k: 'firstPage', l: 'Inicio'}]" 
              :key="h.k"
              class="stats-table__cell stats-table__cell--header stats-table__cell--sortable" 
              @click="toggleSort(h.k as any)">
            <div class="stats-table__header-content">
              {{ h.l }}
              <ChevronUp v-if="sortBy === h.k && sortOrder === 'asc'" :size="12" />
              <ChevronDown v-if="sortBy === h.k && sortOrder === 'desc'" :size="12" />
            </div>
          </th>
          <th class="stats-table__cell stats-table__cell--header stats-table__cell--sortable stats-table__cell--number" 
              @click="toggleSort('pageCount')">
            <div class="stats-table__header-content stats-table__header-content--right">
              Páginas
              <ChevronUp v-if="sortBy === 'pageCount' && sortOrder === 'asc'" :size="12" />
              <ChevronDown v-if="sortBy === 'pageCount' && sortOrder === 'desc'" :size="12" />
            </div>
          </th>
        </tr>
      </thead>
      <tbody v-for="visit in processedVisits" :key="visit.visitId">
        <tr :class="['stats-table__row visit-table__row', getDayParityClass(visit.startedAt)]" @click="toggleRow(visit.visitId)">
          <td class="stats-table__cell">
            <ChevronDown v-if="expandedId === visit.visitId" :size="14" />
            <ChevronRight v-else :size="14" />
          </td>
          <td class="stats-table__cell stats-table__cell--muted">{{ formatDate(visit.startedAt) }}</td>
          <td class="stats-table__cell stats-table__cell--page visit-table__id">{{ visit.visitId }}</td>
          <td class="stats-table__cell stats-table__cell--page">{{ visit.firstPage }}</td>
          <td class="stats-table__cell stats-table__cell--number stats-table__cell--muted">{{ visit.pageCount }}</td>
        </tr>
        <tr v-if="expandedId === visit.visitId" class="visit-table__expanded-row">
          <td colspan="5" class="visit-table__expanded-cell">
            <VisitFlow :views="flowViews[visit.visitId]" :loading="loadingFlows[visit.visitId]" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
