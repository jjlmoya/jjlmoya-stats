<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Period {
  label: string;
  key: string;
}

const PERIODS: Period[] = [
  { label: 'Hoy', key: 'today' },
  { label: '24h', key: '24h' },
  { label: '48h', key: '48h' },
  { label: '7 días', key: '7d' },
  { label: '1 mes', key: '30d' },
  { label: '3 meses', key: '90d' },
  { label: 'Personalizado', key: 'custom' },
];

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

function rangeForKey(key: string): { from: string; to: string } {
  const now = new Date();
  const to = now.toISOString();
  if (key === 'today') {
    const from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return { from: from.toISOString(), to };
  }
  const hours: Record<string, number> = { '24h': 24, '48h': 48, '7d': 168, '30d': 720, '90d': 2160 };
  const from = new Date(now.getTime() - (hours[key] ?? 24) * 60 * 60 * 1000);
  return { from: from.toISOString(), to };
}

function selectPeriod(key: string): void {
  activePeriod.value = key;
  if (key === 'custom') return;
  const { from, to } = rangeForKey(key);
  const label = PERIODS.find((p) => p.key === key)?.label ?? key;
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
    <div class="period-filter__buttons">
      <button
        v-for="p in PERIODS"
        :key="p.key"
        :class="['period-filter__btn', { 'period-filter__btn--active': activePeriod === p.key }]"
        @click="selectPeriod(p.key)"
      >
        {{ p.label }}
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
