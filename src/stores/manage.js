import { getRouters, getUserInfo } from '@/request/manageIndex'
import { defineStore } from 'pinia'
import cookies from 'vue-cookies'

export const useManageUserInfo = defineStore('manageUserInfo', () => {
  const userInfo = reactive({})
  const permissions = ref([])
  const menu = ref([])

  const getFirstMenu = data => {
    let menuItems = data
    let pathSegments = []

    while (menuItems && menuItems.length > 0) {
      if (menuItems[0].children && menuItems[0].children.length > 0) {
        menuItems = menuItems[0].children
      } else {
        pathSegments.push(menuItems[0].path)
        break
      }
    }
    return pathSegments.join('/')
  }

  const setUserInfo = () =>
    new Promise((resolve, reject) => {
      getUserInfo()
        .then(({ data }) => {
          Object.assign(userInfo, data.user)
          permissions.value = data.permissions
          getRouters()
            .then(menus => {
              menu.value = menus.data.data
              resolve(getFirstMenu(menus.data.data))
            })
            .catch(() => {
              reject()
            })
        })
        .catch(() => {
          reject()
        })
    })

  const clearUserInfo = () => {
    cookies.remove('Authorization_Management')
    menu.value = []
    permissions.value = []
    Object.keys(userInfo).forEach(i => (userInfo[i] = undefined))
  }

  return {
    menu,
    permissions,
    userInfo,
    getFirstMenu,
    setUserInfo,
    clearUserInfo
  }
})

export const useManageState = defineStore('manageState', () => {
  const userId = ref('')
  const tradeId = ref('')

  const setUserId = val => {
    userId.value = val
  }

  const setTradeId = val => {
    tradeId.value = val
  }

  return {
    userId,
    setUserId,
    tradeId,
    setTradeId
  }
})
