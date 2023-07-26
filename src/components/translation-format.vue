<script setup>
// @ts-nocheck
import { reactive } from 'vue'
const state = reactive({
    lowercaseLetter: '', // 小驼峰
    strikethrough: '', // 中划线分割
    capital: '',
    timeer: null,
    copyPromptBoxShow: 0
})
const addEventListenerInput = () => {
    if (state.timeer) {
        state.timeer = null
        clearTimeout(state.timeer)
    }
    state.timeer = setTimeout(() => {
        const innerHTML =
            document.querySelector('.ordinary-output span')?.innerHTML ||
            document.querySelector('.ordinary-output')?.innerHTML ||
            document.querySelector('.target-output')?.innerHTML
        if (innerHTML) {
            state.lowercaseLetter = convertStringToCamelCase(innerHTML)
            state.strikethrough = convertStringToStrikethrough(innerHTML)
            state.capital = convertStringToUpperCase(innerHTML)
        }
    }, 1200)
}
addEventListenerInput()
function convertStringToCamelCase(sentence) {
    // 转小驼峰
    return sentence.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (camelCaseMatch, i) {
        if (+camelCaseMatch === 0) return ''
        return i === 0 ? camelCaseMatch.toLowerCase() : camelCaseMatch.toUpperCase()
    })
}
function convertStringToStrikethrough(sentence) {
    // 转中划线分割
    return sentence.toLowerCase().replace(/\s+/g, '-').replace(/,/g, '')
}
function convertStringToUpperCase(sentence) {
    // 转全大写
    return sentence.toUpperCase().replace(/\s+/g, '_').replace(/,/g, '')
}
let timers = null
const selectCopy = async (select, index) => {
    if (select == '') return
    await navigator.clipboard.writeText(select)
    state.copyPromptBoxShow = index
    clearTimeout(timers)
    timers = null
    timers = setTimeout(() => {
        state.copyPromptBoxShow = 0
    }, 1500)
}
let translateHTML = document.querySelector('#baidu_translate_input')
translateHTML.addEventListener('input', addEventListenerInput)
setInterval(() => {
    addEventListenerInput()
}, 2000)
</script>

<template>
    <div class="translation-format-box">
        <div class="translation-format-content-bg">
            <div class="translation-format-content" @click="selectCopy(state.lowercaseLetter, 1)">
                {{ state.lowercaseLetter }}
                <div
                    class="copy-prompt-box"
                    :class="{ 'copy-prompt-box-show': state.copyPromptBoxShow == 1 }">
                    复制成功
                </div>
            </div>
            <div class="line"></div>
            <div class="translation-format-content" @click="selectCopy(state.strikethrough, 2)">
                {{ state.strikethrough }}
                <div
                    class="copy-prompt-box"
                    :class="{ 'copy-prompt-box-show': state.copyPromptBoxShow == 2 }">
                    复制成功
                </div>
            </div>
            <div class="line"></div>
            <div class="translation-format-content" @click="selectCopy(state.capital, 3)">
                {{ state.capital }}
                <div
                    class="copy-prompt-box"
                    :class="{ 'copy-prompt-box-show': state.copyPromptBoxShow == 3 }">
                    复制成功
                </div>
            </div>
            <div class="author-information">by: hemingxuan</div>
            <div class="click-copy">点击即可复制</div>
        </div>
    </div>
</template>

<style scoped>
.translation-format-box {
    width: 1200px;
    margin: auto;
    margin-top: 20px;
    z-index: 99;
    box-sizing: border-box;
    border: 2px solid transparent;
    border-radius: 16px;
    background-clip: padding-box, border-box;
    background-origin: padding-box, border-box;
    background-image: linear-gradient(0deg, rgba(225, 235, 255, 0.3), rgba(225, 235, 255, 0.3)),
        linear-gradient(113.58deg, #fff 16.99%, #e6eeff 94.11%);
}
.translation-format-content-bg {
    width: 100%;
    min-height: 180px;
    border-radius: 14px;
    background: linear-gradient(0deg, #f4f7ff, #f4f7ff),
        linear-gradient(94.84deg, #fff 3.78%, #fcfdff 9.75%, #e6eeff 102.09%),
        linear-gradient(126.58deg, #fff -18.12%, hsla(0, 0%, 100%, 0) 26.77%);
    display: flex;
    position: relative;
}
.translation-format-content {
    padding: 20px;
    width: 33.33%;
    overflow-wrap: anywhere;
    box-sizing: border-box;
    font-size: 24px;
    border: none;
    outline: none;
    resize: none;
    background: transparent;
    cursor: pointer;
    position: relative;
}
.copy-prompt-box {
    width: 80px;
    padding: 10px 20px;
    font-size: 14px;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    border-radius: 4px;
    border: 1px solid #ebeef5;
    background-color: #fff;
    position: absolute;
    top: -30px;
    left: 50%;
    user-select: none;
    transform: translateX(-50%);
    transition: 0.3s;
    opacity: 0;
    text-align: center;
}
.copy-prompt-box-show {
    opacity: 1;
}
.line {
    height: auto;
    margin-top: 20px;
    margin-bottom: 20px;
    border-right-width: 1px;
    border-right-style: dashed;
    border-color: #c8c9cc;
}
.author-information {
    font-size: 22px;
    font-weight: 600;
    color: rgb(228, 228, 228);
    position: absolute;
    right: 10px;
    bottom: 10px;
    user-select: none;
}
.click-copy {
    font-size: 12px;
    color: #000;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: -30px;
    user-select: none;
}
</style>
