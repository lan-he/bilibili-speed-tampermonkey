import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import monkey, { cdn } from 'vite-plugin-monkey'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        monkey({
            entry: 'src/main.js',
            userscript: {
                name: '百度翻译生成多种翻译格式',
                description:
                    '在百度翻译的界面会出现三种格式的英文翻译的结果供你选择,方便程序员命名(小驼峰、class类名)',
                version: '1.0.0',
                author: '何明暄',
                icon: 'https://fanyi.baidu.com/logo.svg',
                namespace: 'npm/vite-plugin-monkey',
                match: ['https://fanyi.baidu.com/'],
            },
            build: {
                externalGlobals: {
                    vue: cdn.jsdelivr('Vue', 'dist/vue.global.prod.js'),
                },
            },
        }),
    ],
})
