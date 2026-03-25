import { ref } from 'vue';
import { getTimeSeries } from '../api/stamp';
import type { TimeSeriesPoint } from '../types/stamp';

const data = ref<TimeSeriesPoint[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

async function fetchTimeSeries(
  page: string,
  from: string,
  to: string,
  granularity: 'day' | 'hour' = 'day',
): Promise<void> {
  loading.value = true;
  error.value = null;
  try {
    const response = await getTimeSeries({ page, from, to, granularity });
    data.value = response.data;
  } catch (e) {
    const err = e as { message?: string };
    error.value = err.message ?? 'Failed to load timeseries';
    data.value = [];
  }
  loading.value = false;
}

export function usePageTimeSeries() {
  return { data, loading, error, fetchTimeSeries };
}
