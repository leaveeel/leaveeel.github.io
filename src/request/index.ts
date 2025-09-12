import http from './http'

/**
 * 获取文本
 */
export const get_local_txt = (url: string) => http.get(url)
