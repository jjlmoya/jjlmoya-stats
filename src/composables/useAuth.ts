import { ref, computed } from 'vue';
import type { User } from '../types/auth';
import { getMe } from '../api/auth';
import { hasTokens, clearTokens } from '../utils/token';

const user = ref<User | null>(null);
const loading = ref(true);
const initialized = ref(false);

const isAuthenticated = computed(() => user.value !== null);

async function initialize(): Promise<void> {
  if (initialized.value) {
    loading.value = false;
    return;
  }

  if (!hasTokens()) {
    loading.value = false;
    initialized.value = true;
    return;
  }

  try {
    const response = await getMe();
    user.value = response.data.user;
  } catch {
    clearTokens();
    user.value = null;
  }

  loading.value = false;
  initialized.value = true;
}

function setUser(u: User): void {
  user.value = u;
}

function clearUser(): void {
  user.value = null;
  clearTokens();
  initialized.value = false;
}

export function useAuth() {
  return {
    user,
    loading,
    isAuthenticated,
    initialize,
    setUser,
    clearUser,
  };
}
