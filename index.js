// ==UserScript==
// @name         bilibili播放视频倍速可随意拖动 0.5x-4x 随意自定义
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  通过可拖动的滑块和快速选择按钮修改哔哩哔哩的视频播放速度，并具有记忆功能 ｜ Modify Bilibili video playback speed with a draggable slider and quick selection buttons, with memory function.
// @author       hemingxuan
// @match        *://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// ==/UserScript==

;(function () {
    'use strict'

    // Function to save playback speed to localStorage
    function saveSpeed(speed) {
        localStorage.setItem('bilibiliPlaybackSpeed', speed)
    }

    // Function to get saved playback speed from localStorage
    function getSavedSpeed() {
        return localStorage.getItem('bilibiliPlaybackSpeed') || '1'
    }

    // Function to create the speed control UI
    function createSpeedControl() {
        // Check if the control is already added
        if (document.getElementById('speed-control-container')) {
            return
        }

        const container = document.createElement('div')
        container.id = 'speed-control-container'
        container.style.display = 'flex'
        container.style.alignItems = 'center'
        container.style.marginBottom = '10px'
        container.style.boxShadow = 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
        // container.style.border = '1px solid #E3E5E7';
        container.style.padding = '10px'
        container.style.borderRadius = '5px'
        container.style.color = '#fff'
        container.style.zIndex = '9999'

        const slider = document.createElement('input')
        slider.classList.add('slider')
        slider.type = 'range'
        slider.min = '0.5'
        slider.max = '4'
        slider.step = '0.1'
        slider.value = getSavedSpeed()
        slider.style.marginRight = '10px'

        //添加滑块样式
        let scrollStyle = `
            <style css-id="scroll">
            .slider {
            }
            </style>
        `
        let div = document.createElement('div')
        let _scrollNode = document.querySelector("[css-id='scroll']") || null
        if (_scrollNode) {
            document.querySelector('head').removeChild(document.querySelector("[css-id='scroll']"))
        }
        div.innerHTML = scrollStyle
        let newScrollNode = div.querySelector("[css-id='scroll']")
        document.getElementsByTagName('head')[0].appendChild(newScrollNode)

        const sliderValue = document.createElement('span')
        sliderValue.style.color = '#000'
        sliderValue.style.marginRight = '16px'
        sliderValue.textContent = `${parseFloat(slider.value).toFixed(1)}x`

        slider.oninput = function () {
            const speed = parseFloat(slider.value).toFixed(1)
            sliderValue.textContent = `${speed}x`
            const video = document.querySelector('video')
            if (video) {
                video.playbackRate = speed
                saveSpeed(speed)
                updateQuickButtons(speed)
            }
        }

        const quickButtons = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4].map((speed) => {
            const button = document.createElement('button')
            button.textContent = `${speed}x`
            button.style.marginLeft = '10px'
            button.style.padding = '5px 10px'
            button.style.border = 'none'
            button.style.borderRadius = '3px'
            button.style.cursor = 'pointer'
            button.style.backgroundColor = '#F1F2F3'
            button.style.color = '#61666D'

            button.onclick = function () {
                slider.value = speed
                slider.oninput()
            }

            return button
        })

        function updateQuickButtons(currentSpeed) {
            quickButtons.forEach((button) => {
                if (parseFloat(button.textContent) === parseFloat(currentSpeed)) {
                    button.style.backgroundColor = '#00AEEC'
                    button.style.color = '#fff'
                } else {
                    button.style.backgroundColor = '#F1F2F3'
                    button.style.color = '#61666D'
                }
            })
        }

        updateQuickButtons(slider.value)

        container.appendChild(slider)
        container.appendChild(sliderValue)
        quickButtons.forEach((button) => container.appendChild(button))

        const videoInfoMeta = document.querySelector('.video-info-meta')
        if (videoInfoMeta) {
            videoInfoMeta.parentNode.style.height = 'auto'
            videoInfoMeta.parentNode.appendChild(container)
        }
    }

    // Initialize the script when DOM is fully loaded
    function init() {
        const video = document.querySelector('video')
        if (video) {
            video.playbackRate = getSavedSpeed()
        }
        createSpeedControl() // Ensure control is created if elements are already present

        // Observe changes to the DOM and re-add the speed control if necessary
        const observer = new MutationObserver((mutations, obs) => {
            const videoInfoMeta = document.querySelector('.video-info-meta')
            if (videoInfoMeta && !document.getElementById('speed-control-container')) {
                createSpeedControl()
                obs.disconnect() // Stop observing once the control is added
            }
        })

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        })
    }

    // Run the script when the document is fully loaded
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(init, 3000) // Delay to ensure all elements are fully loaded
    } else {
        window.addEventListener('DOMContentLoaded', () => setTimeout(init, 3000))
    }
})()
