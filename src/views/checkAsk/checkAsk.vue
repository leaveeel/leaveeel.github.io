<script setup lang="ts">
import { zcForm, zcFormItem, zcInput, zcButton, zcMessage, zcDialog, zcCheckbox } from 'zc-ui-component'
import { shuffleArray } from '@/utils/common'

const formModel = reactive({
  total: 50,
  column: 7,
  blurry: true,
  checkonly: true
})

const handleBlur = (field: 'total' | 'column') => {
  formModel[field] = Math.floor(formModel[field])
}

const submit = () => {
  zcMessage({
    message: 'Submit will reset the selection with total ' + formModel.total + ', column ' + formModel.column + '. Continue to submit?',
    confirmText: 'Submit'
  })
    .then(() => {
      init()
    })
}

const reset = () => {
  zcMessage({
    message: 'Clear will clear all selections. Continue to clear?',
    confirmText: 'Clear'
  })
    .then(() => {
      formModel.total = 50
      formModel.column = 7
      formModel.blurry = true
      formModel.checkonly = true
      question.value = []
      match.value = []
      localStorage.removeItem('formModel')
      localStorage.removeItem('question')
      localStorage.removeItem('match')
      init()
    })
}

const init = () => {
  lastGroup.value = null
  q.value = []
  checkSequence.value = []
  localStorage.removeItem('checkSequence')
  column.value = formModel.column
  localStorage.setItem('formModel', JSON.stringify(formModel))
  setList(formModel.total, formModel.column)
}

const setList = (t: number, c: number) => {
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

const column = ref<number>(formModel.column)
const checkSequence = ref<number[][]>([])

const question = ref<string[][]>([])
const match = ref<string[]>([])

onMounted(() => {
  const saved = localStorage.getItem('formModel')
  const savedSequence = localStorage.getItem('checkSequence')
  const savedQuestion = localStorage.getItem('question')
  const savedMatch = localStorage.getItem('match')
  if (saved) {
    const JSONSAVED = JSON.parse(saved)
    formModel.total = JSONSAVED.total
    formModel.column = JSONSAVED.column
    formModel.blurry = JSONSAVED.blurry
    formModel.checkonly = JSONSAVED.checkonly
    column.value = JSONSAVED.column
    if (savedSequence) {
      checkSequence.value = JSON.parse(savedSequence)
      lastGroup.value = checkSequence.value.length ? checkSequence.value.slice(-1)[0][2] : null
    }
    if (savedQuestion) {
      question.value = JSON.parse(savedQuestion)
    }
    if (savedMatch) {
      match.value = JSON.parse(savedMatch)
    }
    setList(formModel.total, formModel.column)
  } else {
    init()
  }
})

const list = ref()
const q = ref<string[]>([])
const lastGroup = ref<number | null>(null)

const handleCheck = (rowIndex: number, colIndex: number, group: number) => {
  if(JSON.stringify(checkSequence.value.slice(-1)[0]) === JSON.stringify([rowIndex, colIndex, group])) {
    list.value[rowIndex][colIndex][group] = false
    checkSequence.value.pop()
    checkSequence.value.length === 0 ? lastGroup.value = null : (lastGroup.value = group === 0 ? 1 : 0)
  } else if(!list.value[rowIndex][colIndex][group]) {
    if(lastGroup.value !== null && lastGroup.value === group) {
      zcToast.warning(' the question in the different group.')
      return
    }
    lastGroup.value = group
    if(formModel.checkonly) {
      list.value[rowIndex][colIndex][group] = true
      checkSequence.value.push([rowIndex, colIndex, group])
    } else {
      const qItem = createQuestion(group, rowIndex * column.value + colIndex)
      if (qItem) {
        list.value[rowIndex][colIndex][group] = true
        checkSequence.value.push([rowIndex, colIndex, group])
        show.value = true
        q.value = qItem
      }
    }
  }
  localStorage.setItem('checkSequence', JSON.stringify(checkSequence.value))
}

const RSMatch = () => {
  let len = match.value.length
  if(len === 0) return ''
  return match.value[Math.floor(Math.random() * len)]
}

const createQuestion = (group: number, index: number) => {
  if(index >= question.value[group].length) {
    zcToast.warning(`Insufficient: ${index + 1} / ${question.value[group].length}`, { duration: 5000 })
    return false
  }
  return [RSMatch(), question.value[group][index]]
}

const show = ref(false)

const clear = (e: MouseEvent) => {
  (e.currentTarget as HTMLElement).classList.add('is-clear')
}

const input = ref<HTMLInputElement | null>(null)
const inputKey = ref<number>(0)
const inputType = ref<number | null>(null)
const importQuestions = (type: number) => {
  inputType.value = type
  inputKey.value += 1
  input.value?.click()
}

const files = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      let arr = content.split('\n').map((item: string) => item.trim()).filter((item: string) => item)
      if (inputType.value === 0) {
        zcMessage({
          message: `Importing questions total will be set to ${arr.length}. Continue to import?`,
          confirmText: 'Import'
        })
          .then(() => {
            formModel.total = arr.length
            question.value = [shuffleArray(arr), shuffleArray(arr)]
            localStorage.setItem('question', JSON.stringify(question.value))
            init()
          })
      } else if (inputType.value === 1) {
        zcMessage({
          message: `Importing match will be set to ${arr.length}. Continue to import?`,
          confirmText: 'Import'
        })
          .then(() => {
            match.value = shuffleArray(arr)
            localStorage.setItem('match', JSON.stringify(match.value))
            init()
          })
      }
    }
    reader.readAsText(file)
  }
}
</script>

<template>
  <zcForm class="setting" :model="formModel" inline @submit="submit">
    <zcFormItem label="Total">
      <zcInput v-model="formModel.total" type="number" :min="1" @blur="handleBlur('total')" :disabled="question.length" />
    </zcFormItem>
    <zcFormItem label="Column">
      <zcInput v-model="formModel.column" type="number" :min="1" @blur="handleBlur('column')" />
    </zcFormItem>
    <zcFormItem label="Blurry" v-if="!formModel.checkonly">
      <zcCheckbox v-model="formModel.blurry" />
    </zcFormItem>
    <zcFormItem label="checkonly">
      <zcCheckbox v-model="formModel.checkonly" :disabled="!question.length" />
    </zcFormItem>
    <zcFormItem>
      <zcButton type="primary" htmlType="submit">Reset</zcButton>
    </zcFormItem>
    <zcFormItem>
      <zcButton type="danger" text @click="reset">Clear</zcButton>
    </zcFormItem>
    <zcFormItem>
      <zcButton type="warning" plain @click="importQuestions(0)">Import Questions</zcButton>
    </zcFormItem>
    <zcFormItem>
      <zcButton type="warning" plain @click="importQuestions(1)">Import Match</zcButton>
    </zcFormItem>
    <input ref="input" :key="inputKey" type="file" @change="files" style="display: none;" />
  </zcForm>

  <div class="check-ask" v-if="list">
    <div class="ask-row" v-for="(row, rowIndex) in list" :key="rowIndex" :style="{'--column-count': column}">
      <div class="ask-item" v-for="(col, colIndex) in row" :key="colIndex">
        <span>{{ rowIndex * column + colIndex + 1 }}</span>
        <div class="check">
          <div class="check-item" :class="{ check: col[0], last: checkSequence.length && checkSequence.slice(-1)[0][0] === rowIndex && checkSequence.slice(-1)[0][1] === colIndex && checkSequence.slice(-1)[0][2] === 0 }" @click="handleCheck(rowIndex, colIndex, 0)"></div>
          <div class="check-item" :class="{ check: col[1], last: checkSequence.length && checkSequence.slice(-1)[0][0] === rowIndex && checkSequence.slice(-1)[0][1] === colIndex && checkSequence.slice(-1)[0][2] === 1 }" @click="handleCheck(rowIndex, colIndex, 1)"></div>
        </div>
      </div>
    </div>
  </div>

  <zcDialog v-model="show" :close-on-click-modal="false" closeIcon>
    <template #header>Question</template>
    <p :class="{ blurry: formModel.blurry }" @click="clear">{{ q[0] }}</p>
    <p :class="{ blurry: formModel.blurry }" @click="clear">{{ q[1] }}</p>
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
            &.last {
              border: 2px solid #f00;
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
            &.last {
              border: 2px solid #00f;
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

.blurry {
  filter: blur(6px);
  transition: filter 0.2s ease;
  user-select: none;
  cursor: pointer;
}

.blurry.is-clear {
  filter: blur(0);
  user-select: auto;
}
</style>