import { ref } from "vue";

const isCollapsed = ref(false);

export const useSidebar = () => {
  return { isCollapsed };
};