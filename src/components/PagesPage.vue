<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useStats } from '../composables/useStats';
import { usePageTimeSeries } from '../composables/usePageTimeSeries';
import PeriodFilter from './PeriodFilter.vue';
import PageList from './PageList.vue';
import PageEvolutionChart from './PageEvolutionChart.vue';
import NoPermission from './NoPermission.vue';

const { data: pages, loading: pagesLoading, forbidden, fetchStats } = useStats();
const { data: tsData, loading: tsLoading, fetchTimeSeries } = usePageTimeSeries();

const selectedPage = ref<string | null>(null);
const currentFrom = ref('');
const currentTo = ref('');
const hasAutoSelected = ref(false);

function getUrlPage(): string | null {
  return new URLSearchParams(window.location.search).get('p');
}

function onPeriodChange(from: string, to: string): void {
  currentFrom.value = from;
  currentTo.value = to;
  fetchStats({ from, to });
  if (selectedPage.value) {
    fetchTimeSeries(selectedPage.value, from, to);
  }
}

function onSelectPage(page: string): void {
  selectedPage.value = page;
  window.history.pushState(null, '', '?p=' + encodeURIComponent(page));
  fetchTimeSeries(page, currentFrom.value, currentTo.value);
}

watch(pages, (newPages) => {
  if (hasAutoSelected.value || !newPages.length) return;
  const urlPage = getUrlPage();
  if (urlPage && newPages.some((p) => p.page === urlPage)) {
    hasAutoSelected.value = true;
    onSelectPage(urlPage);
  }
});

onMounted(() => {
  const urlPage = getUrlPage();
  if (urlPage) selectedPage.value = urlPage;
});
</script>

<template>
  <div class="pages-page">
    <span class="pages-page__title">Páginas</span>
    <PeriodFilter initial-period="7d" @change="onPeriodChange" />
    <NoPermission v-if="forbidden" />
    <template v-else>
      <PageList
        :pages="pages"
        :selected="selectedPage"
        :loading="pagesLoading"
        @select="onSelectPage"
      />
      <div class="pages-page__chart-area">
        <div v-if="!selectedPage" class="pages-page__empty">
          <span class="pages-page__empty-text">Selecciona una página para ver su evolución</span>
        </div>
        <template v-else>
          <span class="pages-page__chart-label">{{ selectedPage }}</span>
          <PageEvolutionChart :data="tsData" :loading="tsLoading" />
        </template>
      </div>
    </template>
  </div>
</template>

<style scoped>
@import "./PagesPage.css";
</style>
