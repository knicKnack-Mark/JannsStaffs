export const usePageLoader = () => {
  const isPageLoading = useState('isPageLoading', () => false)
  const loadingCount = useState('pageLoadingCount', () => 0)

  const startPageLoading = () => {
    loadingCount.value++
    isPageLoading.value = true
  }

  const stopPageLoading = (delay = 500) => {
    setTimeout(() => {
      loadingCount.value = Math.max(loadingCount.value - 1, 0)

      if (loadingCount.value === 0) {
        isPageLoading.value = false
      }
    }, delay)
  }

  const forceStopPageLoading = () => {
    loadingCount.value = 0
    isPageLoading.value = false
  }

  return {
    isPageLoading,
    startPageLoading,
    stopPageLoading,
    forceStopPageLoading
  }
}