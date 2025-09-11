import { defineStore } from 'pinia'

/**
 * 储存降ai结果
 */
export const useHumanizerResult = defineStore('humanizerResult', () => {
  const result = reactive({})

  const setResult = obj => {
    Object.assign(result, obj)
  }

  const cleanResult = () => {
    Object.keys(result).forEach(i => (result[i] = undefined))
  }

  return {
    result,
    setResult,
    cleanResult
  }
})
