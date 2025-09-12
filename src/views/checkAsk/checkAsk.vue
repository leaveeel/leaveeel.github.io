<script setup lang="ts">
import { zcForm, zcFormItem, zcInput, zcButton, zcMessage, zcDialog } from 'zc-ui-component'
import {get_local_txt} from '@/request'
import { shuffleArray } from '@/utils/common'

const formModel = reactive({
  field1: 50,
  field2: 7
})

const handleBlur = (field: 'field1' | 'field2') => {
  formModel[field] = Math.floor(formModel[field])
}

const submit = () => {
  zcMessage({
    message: 'Submit will reset the selection with total ' + formModel.field1 + ', column ' + formModel.field2 + '. Continue to submit?',
    confirmText: 'Submit'
  })
  .then(() => {
    column.value = formModel.field2
    localStorage.removeItem('checkSequence')
    checkSequence.value = []
    localStorage.setItem('formModel', formModel.field1 + ',' + formModel.field2)
    setList(formModel.field1, formModel.field2)
  })
}

const setList = (t:number, c:number) => {
  const row = Math.ceil(t / c)
  const init = Array.from({ length: row }, (_, i) =>
    Array.from({ length: c }, (_, j) => {
      const index = i * c + j
      if (index < t) {
        return [false, false]
      }
    }).filter(item => item)
  )
  if (checkSequence.value.length) {
    checkSequence.value.forEach(([r, col, g]) => {
      if (init[r] && init[r][col]) {
        init[r][col][g] = true
      }
    })
  }
  list.value = init
}

const column = ref<number>(formModel.field2)
const checkSequence = ref<number[][]>([])

const question = ref<string[]>([])
const match = ref<string[]>([])
const loadT = () => {
  get_local_txt('/Question.txt').then(res => {
    let arr = res.data.split('\n').map((item: string) => item.trim()).filter((item: string) => item)
    question.value = shuffleArray(arr)
  })
  get_local_txt('/Match.txt').then(res => {
    let arr = res.data.split('\n').map((item: string) => item.trim()).filter((item: string) => item)
    match.value = shuffleArray(arr)
  })
}

onMounted(() => {
  const saved = localStorage.getItem('formModel')
  const savedSequence = localStorage.getItem('checkSequence')
  loadT()
  if (saved) {
    const [f1, f2] = saved.split(',').map(Number)
    formModel.field1 = f1
    formModel.field2 = f2
    column.value = f2
    if (savedSequence) {
      checkSequence.value = JSON.parse(savedSequence)
    }
  } else {
    localStorage.removeItem('checkSequence')
    localStorage.setItem('formModel', formModel.field1 + ',' + formModel.field2)
  }
  setList(formModel.field1, formModel.field2)
})

const list = ref()
const q = ref<string[]>([])

const handleCheck = (rowIndex: number, colIndex: number, group: number) => {
  if(JSON.stringify(checkSequence.value.slice(-1)[0]) === JSON.stringify([rowIndex, colIndex, group])) {
    list.value[rowIndex][colIndex][group] = false
    checkSequence.value.pop()
  } else if(!list.value[rowIndex][colIndex][group]) {
    const qItem = createQuestion(rowIndex * column.value + colIndex)
    if (qItem) {
      list.value[rowIndex][colIndex][group] = true
      checkSequence.value.push([rowIndex, colIndex, group])
      show.value = true
      q.value = qItem
    }
  }
  localStorage.setItem('checkSequence', JSON.stringify(checkSequence.value))
}

const RSMatch = () => {
  let len = match.value.length
  if(len === 0) return ''
  return match.value[Math.floor(Math.random() * len)]
}

const createQuestion = (index: number) => {
  if(index >= question.value.length) {
    zcToast.warning(`Insufficient: ${index} / ${question.value.length}`, { duration: 5000 })
    return false
  }
  return [RSMatch(), question.value[index]]
}

const show = ref(false)
</script>

<template>
  <zcForm class="setting" :model="formModel" inline @submit="submit">
    <zcFormItem label="Total">
      <zcInput v-model="formModel.field1" type="number" :min="1" @blur="handleBlur('field1')" />
    </zcFormItem>
    <zcFormItem label="Column">
      <zcInput v-model="formModel.field2" type="number" :min="1" @blur="handleBlur('field2')" />
    </zcFormItem>
    <zcFormItem>
      <zcButton type="primary" htmlType="submit">Reset</zcButton>
    </zcFormItem>
  </zcForm>

  <div class="check-ask" v-if="list">
    <div class="ask-row" v-for="(row, rowIndex) in list" :key="rowIndex" :style="{'--column-count': column}">
      <div class="ask-item" v-for="(col, colIndex) in row" :key="colIndex">
        <span>{{ rowIndex * column + colIndex + 1 }}</span>
        <div class="check">
          <div class="check-item" :class="{ check: col[0] }" @click="handleCheck(rowIndex, colIndex, 0)"></div>
          <div class="check-item" :class="{ check: col[1] }" @click="handleCheck(rowIndex, colIndex, 1)"></div>
        </div>
      </div>
    </div>
  </div>

  <zcDialog v-model="show" :close-on-click-modal="false" closeIcon>
    <template #header>Question</template>
    <p>{{ q[0] }}</p>
    <p>{{ q[1] }}</p>
  </zcDialog>
</template>

<style lang="scss" scoped>
.setting {
  margin: 20px;
}

.check-ask {
  margin: 1em auto;
  display: grid;
  gap: 10px;
  background-color: #ffecf8;
  width: min-content;
  border: 10px solid #ffecf8;
  .ask-row {
    display: grid;
    grid-template-columns: repeat(var(--column-count), 140px);
    gap: 10px;
    .ask-item {
      display: grid;
      grid-template-rows: auto 1fr;
      height: 100px;
      span {
        background-color: #fff;
        display: block;
        text-align: center;
        line-height: 2;
        border-bottom: 1px dashed #ccc;
      }
      .check {
        display: flex;
        gap: 1px;
        background-color: #eef;
        .check-item {
          flex: 1;
          height: 100%;
          background-color: #fff;
          cursor: pointer;
          transition: background-color 0.5s;
          &:nth-child(2n-1) {
            &.check {
              background-color: #f99;
            }
            &:hover {
              &:not(.check) {
                background-color: #fee;
              }
            }
          }
          &:nth-child(2n) {
            &.check {
              background-color: #99f;
            }
            &:hover {
              &:not(.check) {
                background-color: #eef;
              }
            }
          }
        }
      }
    }
  }
}
</style>