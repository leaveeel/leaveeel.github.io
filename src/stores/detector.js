import { defineStore } from 'pinia'

/**
 * 储存ai检测结果
 */
export const useDetectorResult = defineStore('detectorResult', () => {
  const result = reactive({})
  const humanizeResult = reactive({})

  const setResult = obj => {
    Object.assign(result, obj)
  }

  const cleanResult = () => {
    cleanHumanizeResult()
    Object.keys(result).forEach(i => (result[i] = undefined))
  }

  const setHumanizeResult = obj => {
    Object.assign(humanizeResult, obj)
  }

  const cleanHumanizeResult = () => {
    Object.keys(humanizeResult).forEach(i => (humanizeResult[i] = undefined))
  }

  return {
    result,
    setResult,
    cleanResult,
    humanizeResult,
    setHumanizeResult,
    cleanHumanizeResult
  }
})
