<template>
    <h1>MAYBE Y<span @click="handleClick">0</span>U NEED T<span @click="handleClick">0</span> ENTER THE R<span @click="handleClick">1</span>GHT WEBSITE</h1>
</template>

<script setup lang="ts">
const router = useRouter();

const box = ref<string>('')

onMounted(() => {
    if(localStorage.getItem('access') === '1') {
        router.push({ path: '/checkAsk' })
    }
})

const handleClick = (e: any) => {
    let text = e.target.innerText
    if(box.value.length === 0 && text === '1') {
        box.value += text
        e.target.innerText = 'I'
    } else if((box.value.length === 1 || box.value.length === 2) && text === '0') {
        box.value += text
        e.target.innerText = 'O'
    }
    if(box.value === '100') {
        localStorage.setItem('access', '1')
        router.push({ path: '/checkAsk' })
    }
}
</script>

<style scoped>
h1 {
    font-family: 'Courier New', Courier, monospace;
}
</style>