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
  const setDialogLoading = (val: boolean) => {
    dialogLoading.value = val
  }

  const setButtonLoading = (val: boolean) => {
    buttonLoading.value = val
  }

  const setLoading = (val: boolean) => {
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

/**
 * 请求id，用于轮询获取结果的标识，requestid更新表示有其他动作，停止接口轮询
 * @param {number} requestId 请求id
 */
const useRequestId = defineStore('requestId', () => {
  const requestId = ref(1)

  const setRequestId = () => {
    requestId.value++
  }

  return { requestId, setRequestId }
})

export {
  useLoading,
  useRequestId
}
