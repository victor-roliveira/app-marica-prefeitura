import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'

export default defineConfig({
  plugins: [
    vue(),
    vuetify({
      autoImport: true, // IMPORTANTE
    })
  ],

  // Evitar problemas de bibliotecas antigas
  optimizeDeps: {
    include: ['object-assign']
  }
})
