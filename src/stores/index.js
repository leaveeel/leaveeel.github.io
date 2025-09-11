import { defineStore } from 'pinia'

/**
 * 全局加载状态
 * @param {boolean} dialogLoading 对话框加载状态
 * @param {boolean} loading 组件加载状态
 */
const useLoading = defineStore('loading', () => {
  const dialogLoading = ref(false)
  const loading = ref(false)
  const buttonLoading = ref(false)
  const setDialogLoading = val => {
    dialogLoading.value = val
  }

  const setButtonLoading = val => {
    buttonLoading.value = val
  }

  const setLoading = val => {
    loading.value = val
  }

  return {
    dialogLoading,
    setDialogLoading,
    loading,
    setLoading,
    buttonLoading,
    setButtonLoading
  }
})

export {
  useLoading
}
