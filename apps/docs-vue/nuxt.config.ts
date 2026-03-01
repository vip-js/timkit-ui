// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from 'pathe'

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  css: ['~/styles/globals.css'],

  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
    },
  },

  app: {
    head: {
      title: 'TimUI - Vue Documentation',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Beautiful and accessible Vue components built with Zag.js' }
      ]
    }
  },

  typescript: {
    strict: true
  },

  // 配置导入别名
  alias: {
    '@': resolve(__dirname, '.'),
    '@/registry': resolve(__dirname, 'registry'),
  },

  // Vite 配置
  vite: {
    resolve: {
      alias: {
        '@': resolve(__dirname, '.'),
        '@/registry': resolve(__dirname, 'registry'),
      }
    }
  },

  // 构建配置
  build: {
    transpile: ['@timui/vue']
  }
})
