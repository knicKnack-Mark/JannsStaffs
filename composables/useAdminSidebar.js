export const useAdminSidebar = () => {
  const collapsed = useState('admin-sidebar-collapsed', () => false)

  const toggleSidebar = () => {
    collapsed.value = !collapsed.value
  }

  return {
    collapsed,
    toggleSidebar
  }
}