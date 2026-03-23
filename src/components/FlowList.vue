<script setup lang="ts">
import { ref, computed } from 'vue';
import { getVisits } from '../api/stamp';
import type { VisitSummary } from '../types/stamp';
import NoPermission from './NoPermission.vue';
import PeriodFilter from './PeriodFilter.vue';
import VisitTable from './VisitTable.vue';
import StatCard from './StatCard.vue';

const visits = ref<VisitSummary[]>([]);
const loadingList = ref(false);
const error = ref<string | null>(null);
const forbidden = ref(false);
const periodLabel = ref('Hoy');

const avgPages = computed(() => {
  if (visits.value.length === 0) return 0;
  const total = visits.value.reduce((s, v) => s + v.pageCount, 0);
  return (total / visits.value.length).toFixed(1);
});

async function onPeriodChange(from: string, to: string, label: string): Promise<void> {
  periodLabel.value = label;
  loadingList.value = true;
  error.value = null;
  forbidden.value = false;
  visits.value = [];

  try {
    const res = await getVisits({ from, to });
    visits.value = res.data;
  } catch (e) {
    const err = e as { code?: string; message?: string };
    if (err.code === 'FORBIDDEN' || err.message === 'Forbidden') {
      forbidden.value = true;
    } else {
      error.value = err.message ?? 'Failed to load visits';
    }
  }

  loadingList.value = false;
}
</script>

<template>
  <div class="overview">
    <div class="overview__header">
      <span class="overview__period">Flujos de Navegación</span>
      <span class="overview__date">{{ periodLabel }}</span>
    </div>

    <PeriodFilter initial-period="today" @change="onPeriodChange" />

    <div v-if="loadingList && visits.length === 0" class="auth-guard">
      <span class="auth-guard__text">Sincronizando visitas...</span>
    </div>
    <NoPermission v-else-if="forbidden" />
    <div v-else-if="error" class="auth-guard">
      <span class="auth-guard__error">{{ error }}</span>
    </div>

    <template v-else>
      <div class="overview__cards flow-list__cards">
        <StatCard label="Sesiones registradas" :value="visits.length" />
        <StatCard label="Promedio pasos" :value="avgPages" unit="págs" />
      </div>

      <div class="overview__section">
        <span class="overview__section-title">Listado de Visitas</span>
        <div class="overview__table-wrap">
          <VisitTable 
            :visits="visits" 
            :loading="loadingList" 
          />
        </div>
      </div>
    </template>
  </div>
</template>
