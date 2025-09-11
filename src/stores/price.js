import { subscribe } from '@/request'
import { defineStore } from 'pinia'
import { zcLoading } from 'zc-ui-component'

/**
 * 订阅方案list
 * k: 0月付 1季付 2年付
 */
export const useScheme = defineStore('scheme', () => {
  const scheme = reactive({})

  const setScheme = (k, v) => {
    scheme[k] = v
  }

  const toSubscribe = (id, orderType) => {
    zcLoading.updateOptions({
      text: 'Jump to payment...',
      size: 100,
      fontSize: 30
    })
    zcLoading.show()
    localStorage.removeItem('paymentResult')
    subscribe({ subscribeId: id, orderType: orderType })
      .then(({ data }) => {
        if (data.code === 0) {
          window.open(data.data.checkoutSessionUrl, '_blank')
        } else {
          zcToast.error('Subscribe failed')
        }
      })
      .finally(() => {
        zcLoading.hide()
      })
  }

  return { scheme, setScheme, toSubscribe }
})
