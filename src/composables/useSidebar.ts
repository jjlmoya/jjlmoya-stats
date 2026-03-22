import { ref } from 'vue';

const isOpen = ref(false);

export function useSidebar() {
  function toggle(): void {
    isOpen.value = !isOpen.value;
  }

  function close(): void {
    isOpen.value = false;
  }

  return { isOpen, toggle, close };
}
