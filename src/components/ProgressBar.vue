<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  pct: number;
}

const props = defineProps<Props>();
const width = computed(() => props.pct + '%');
</script>

<template>
  <div class="progress-bar">
    <div class="progress-bar__fill" />
  </div>
</template>

<style scoped>
@import "./ProgressBar.css";

.progress-bar__fill {
  width: v-bind(width);
}
</style>



