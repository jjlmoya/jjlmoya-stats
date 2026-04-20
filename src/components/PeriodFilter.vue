<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Period {
  label: string;
  key: string;
}

const NAMED: Period[] = [
  { label: 'Hoy', key: 'today' },
  { label: 'Ayer', key: 'yesterday' },
  { label: 'Semana pasada', key: 'last-week' },
  { label: 'Mes pasado', key: 'last-month' },
];

const RELATIVE: Period[] = [
  { label: '24h', key: '24h' },
  { label: '48h', key: '48h' },
  { label: '7 días', key: '7d' },
  { label: '1 mes', key: '30d' },
  { label: '3 meses', key: '90d' },
];

const ALL = [...NAMED, ...RELATIVE, { label: 'Personalizado', key: 'custom' }];

interface Props {
  initialPeriod?: string;
}

const props = withDefaults(defineProps<Props>(), { initialPeriod: 'today' });

const emit = defineEmits<{
  change: [from: string, to: string, label: string];
}>();

const activePeriod = ref(props.initialPeriod);

function defaultFrom(): string {
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  return d.toISOString().slice(0, 10);
}

const customFrom = ref(defaultFrom());
const customTo = ref(new Date().toISOString().slice(0, 10));

type Range = { from: string; to: string };

function todayRange(now: Date): Range {
  return { from: new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString(), to: now.toISOString() };
}

function yesterdayRange(now: Date): Range {
  const from = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  const to = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, -1);
  return { from: from.toISOString(), to: to.toISOString() };
}

function lastWeekRange(now: Date): Range {
  const d = now.getDay();
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (d === 0 ? 6 : d - 1) - 7);
  const sunday = new Date(monday.getTime() + 6 * 24 * 60 * 60 * 1000 + 86399999);
  return { from: monday.toISOString(), to: sunday.toISOString() };
}

function lastMonthRange(now: Date): Range {
  const from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const to = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
  return { from: from.toISOString(), to: to.toISOString() };
}

function namedRange(key: string, now: Date): Range | null {
  if (key === 'today') return todayRange(now);
  if (key === 'yesterday') return yesterdayRange(now);
  if (key === 'last-week') return lastWeekRange(now);
  if (key === 'last-month') return lastMonthRange(now);
  return null;
}

function rangeForKey(key: string): { from: string; to: string } {
  const now = new Date();
  const named = namedRange(key, now);
  if (named) return named;
  const hours: Record<string, number> = { '24h': 24, '48h': 48, '7d': 168, '30d': 720, '90d': 2160 };
  const from = new Date(now.getTime() - (hours[key] ?? 24) * 60 * 60 * 1000);
  return { from: from.toISOString(), to: now.toISOString() };
}

function selectPeriod(key: string): void {
  activePeriod.value = key;
  if (key === 'custom') return;
  const { from, to } = rangeForKey(key);
  const label = ALL.find((p) => p.key === key)?.label ?? key;
  emit('change', from, to, label);
}

function applyCustom(): void {
  const from = new Date(customFrom.value).toISOString();
  const to = new Date(customTo.value + 'T23:59:59').toISOString();
  emit('change', from, to, 'Personalizado');
}

onMounted(() => selectPeriod(props.initialPeriod));
</script>

<template>
  <div class="period-filter">
    <div class="period-filter__row">
      <div class="period-filter__group">
        <span class="period-filter__group-label">Período</span>
        <div class="period-filter__buttons">
          <button
            v-for="p in NAMED"
            :key="p.key"
            :class="['period-filter__btn', { 'period-filter__btn--active': activePeriod === p.key }]"
            @click="selectPeriod(p.key)"
          >
            {{ p.label }}
          </button>
        </div>
      </div>
      <div class="period-filter__divider" />
      <div class="period-filter__group">
        <span class="period-filter__group-label">Últimos</span>
        <div class="period-filter__buttons">
          <button
            v-for="p in RELATIVE"
            :key="p.key"
            :class="['period-filter__btn', { 'period-filter__btn--active': activePeriod === p.key }]"
            @click="selectPeriod(p.key)"
          >
            {{ p.label }}
          </button>
        </div>
      </div>
      <div class="period-filter__divider" />
      <button
        :class="['period-filter__btn', { 'period-filter__btn--active': activePeriod === 'custom' }]"
        @click="selectPeriod('custom')"
      >
        Personalizado
      </button>
    </div>
    <div v-if="activePeriod === 'custom'" class="period-filter__custom">
      <div class="period-filter__custom-inputs">
        <div class="period-filter__field">
          <label class="period-filter__label">Desde</label>
          <input v-model="customFrom" class="period-filter__input" type="date" />
        </div>
        <div class="period-filter__field">
          <label class="period-filter__label">Hasta</label>
          <input v-model="customTo" class="period-filter__input" type="date" />
        </div>
        <button class="period-filter__apply" @click="applyCustom">Aplicar</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "./PeriodFilter.css";
</style>
