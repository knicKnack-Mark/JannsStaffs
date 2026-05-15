import { ref, onMounted, onUnmounted } from 'vue';

export function useScrollVisibility() {
  const isNavbarVisible = ref(true);
  let lastScrollY = 0;

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    isNavbarVisible.value = currentScrollY < lastScrollY || currentScrollY <= 10;
    lastScrollY = currentScrollY;
  };

  onMounted(() => window.addEventListener('scroll', handleScroll));
  onUnmounted(() => window.removeEventListener('scroll', handleScroll));

  return { isNavbarVisible };
}