import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        'f1-quiz': resolve(__dirname, 'f1-quiz/index.html'),
        'football': resolve(__dirname, 'football/index.html'),
        'capitals': resolve(__dirname, 'capitals/index.html'),
        'cpo-sim': resolve(__dirname, 'cpo-sim/index.html'),
        'analytics': resolve(__dirname, 'analytics/index.html'),
        'betting': resolve(__dirname, 'betting/index.html'),
        'quiz': resolve(__dirname, 'quiz/index.html'),
        'worldcup': resolve(__dirname, 'worldcup/index.html'),
        'ferrari': resolve(__dirname, 'ferrari/index.html'),
        'europe': resolve(__dirname, 'europe/index.html'),
      },
    },
  },
})
