import { useRequestId } from '@/stores/index'
import axios, { InternalAxiosRequestConfig } from 'axios'
import { zcToast } from 'zc-ui-component'

// Extend Axios config to include custom properties
declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    requestId?: number
    notoast?: boolean
  }
}

// 创建axios实例，超时60秒
const http = axios.create({ timeout: 60000 })

// 请求拦截器
http.interceptors.request.use(
  config => {
    switch (config.method) {
      case 'post':
        if (config?.data?.params) {
          config.url = `${config.url}?${Object.entries(config.data.params)
            .map(([key, value]) => `${key}=${value}`)
            .join('&')}`
          delete config.data.params
        }
        break
      case 'get':
        break
      case 'put':
        break
      case 'delete':
        break
      default:
        break
    }
    return config
  },
  error => Promise.reject(error)
)

// 响应拦截器
http.interceptors.response.use(
  response => {
    if (
      response.config.requestId &&
      response.config.requestId !== useRequestId().requestId
    )
      return Promise.reject('break')

    switch (response.status) {
      case 200:
        if (response.data.code === 0 || !response.data.code) {
          return response
        } else {
          if (!response.config.notoast && response.data.msg) {
            zcToast.error(response.data.msg)
          }
          return Promise.reject(response)
        }
      default:
        if (!response.config.notoast) {
          zcToast.error(response.data.msg)
        }
        return Promise.reject(response)
    }
  },
  error => {
    if (!error.config.notoast) {
      zcToast.error(error?.data?.msg || 'Request Error')
    }
    return Promise.reject(error)
  }
)

export default http
