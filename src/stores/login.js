import {
  get_balance_word_count,
  get_my_acount_info,
  select_my_subscribed
} from '@/request'
import { defineStore } from 'pinia'
import cookies from 'vue-cookies'
import { zcLoading } from 'zc-ui-component'
import {
  useDetectorResult,
  useHumanizerResult,
  useRequestId,
  useUpload
} from './index'

/**
 * 初始导航
 */
const menu = reactive([
  {
    name: 'Home',
    url: '/'
  },
  {
    name: 'AI Detector',
    url: '/AIDetector'
  },
  {
    name: 'AI Humanizer',
    url: '/AIHumanizer'
  },
  {
    name: 'Pricing',
    url: '/Pricing'
  }
])

export const useUserInfo = defineStore('userInfo', () => {
  const userInfo = reactive({})
  const subscription = reactive({})
  const balanceWord = ref(0)

  const setSubscription = () => {
    return new Promise((resolve, reject) => {
      select_my_subscribed()
        .then(({ data }) => {
          Object.assign(subscription, data.data)
          if (data.data.accountType !== 9) {
            useUserInfo()
              .setBalanceWord()
              .then(() => {
                resolve()
              })
          } else {
            resolve()
          }
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  const setUserInfo = () => {
    return new Promise((resolve, reject) => {
      get_my_acount_info()
        .then(({ data }) => {
          Object.assign(userInfo, data.data)
          resolve()
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  const setBalanceWord = () => {
    return new Promise((resolve, reject) => {
      get_balance_word_count()
        .then(({ data }) => {
          balanceWord.value = data.data
          resolve()
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  const clearUserInfo = () => {
    cookies.remove('AI_Authorization')
    useLogin().setAI_Authorization('')
    useDetectorResult().cleanResult()
    useHumanizerResult().cleanResult()
    useUpload().clean()
    if (menu.at(-1).name === 'My Account') {
      menu.pop()
    }
    Object.keys(userInfo).forEach(i => (userInfo[i] = undefined))
    Object.keys(subscription).forEach(i => (subscription[i] = undefined))
    balanceWord.value = 0
  }

  return {
    userInfo,
    subscription,
    balanceWord,
    setSubscription,
    setUserInfo,
    setBalanceWord,
    clearUserInfo
  }
})

/**
 * 登录
 * @param {boolean} loginVisible 登录弹窗
 * @param {boolean} signupVisible 注册弹窗
 * @param {boolean} loading 登录loading
 * @param {string} AI_Authorization 用户token
 */
export const useLogin = defineStore('login', () => {
  const loginVisible = ref(false)
  const signupVisible = ref(false)

  const AI_Authorization = ref('')

  const setAI_Authorization = value => {
    AI_Authorization.value = value
  }

  // 登录动作
  const login = login => {
    // 未登录状态不执行
    if (!cookies.get('AI_Authorization')) return

    // 设置用户token
    setAI_Authorization(cookies.get('AI_Authorization'))
    // 清除其他信息
    useDetectorResult().cleanResult()
    useHumanizerResult().cleanResult()

    zcLoading.updateOptions({
      text: ''
    })
    zcLoading.show()

    // 获取全部信息
    Promise.all([useUserInfo().setUserInfo(), useUserInfo().setSubscription()])
      .then(() => {
        menu.push({
          name: 'My Account',
          url: '/MyAccount'
        })
        if (login) {
          zcToast('Login success', { type: 'success' })
          // getRouter().push({ name: 'Home' })
          useLogin().setSignupVisible(false)
          useLogin().setLoginVisible(false)
        }
      })
      .catch(() => {
        useUserInfo().clearUserInfo()
        if (login) {
          zcToast('Login failed', { type: 'error' })
        }
      })
      .finally(() => {
        zcLoading.hide()
      })
  }

  const setSignupVisible = t => {
    useRequestId().setRequestId()
    signupVisible.value = t
  }

  const setLoginVisible = t => {
    useRequestId().setRequestId()
    loginVisible.value = t
  }

  return {
    menu,
    AI_Authorization,
    setAI_Authorization,
    login,
    setSignupVisible,
    signupVisible,
    setLoginVisible,
    loginVisible
  }
})
