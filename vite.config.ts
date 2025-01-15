import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  
  server: {
    proxy: {
      '/existingMedicines': 'http://localhost:5000',
      '/chosenMedicines': 'http://localhost:5000',
    },
  },
})
