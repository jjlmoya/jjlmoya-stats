<script setup lang="ts">
interface Props {
  label: string;
  value: string | number;
  delta?: number;
  unit?: string;
}

defineProps<Props>();

const getClassName = (delta?: number): string => {
  if (delta === undefined) return '';
  if (delta >= 0) return 'stat-card__delta--up';
  return 'stat-card__delta--down';
};

const formatDelta = (delta?: number): string => {
  if (delta === undefined) return '';
  return delta >= 0 ? `+${delta}%` : `${delta}%`;
};
</script>

<template>
  <div class="stat-card">
    <span class="stat-card__label">{{ label }}</span>
    <div class="stat-card__value-row">
      <span class="stat-card__value">{{ value }}</span>
      <span v-if="unit" class="stat-card__unit">{{ unit }}</span>
    </div>
    <span
      v-if="delta !== undefined"
      :class="[
        'stat-card__delta',
        getClassName(delta),
      ]"
    >
      {{ formatDelta(delta) }}
    </span>
  </div>
</template>
