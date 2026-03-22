import { watch } from 'vue';
import { useAuth } from './useAuth';

export function useAuthGuard(): void {
  const { isAuthenticated, loading, initialize } = useAuth();

  function checkAccess(): void {
    if (loading.value) return;
    if (!isAuthenticated.value) {
      window.location.href = '/login';
    }
  }

  initialize().then(checkAccess);
  watch([loading, isAuthenticated], checkAccess);
}
