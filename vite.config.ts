import { defineConfig } from 'vite'
import pugPlugin from 'vite-plugin-pug'

// локальні змінні (якщо треба)
const locals = {}

export default defineConfig({
  plugins: [pugPlugin({}, locals)],
  root: 'pages', // ← головна зміна!
  build: {
    outDir: '../dist',
  },
})