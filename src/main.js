import { createApp } from 'vue'
import App from './App.vue'
import router from './routes/index'
import vuetify from './plugins/vuetify' 
import '@mdi/font/css/materialdesignicons.css' // <-- ICONES
import 'vuetify/styles'  // <-- ESTILOS DO VUETIFY (MUITO IMPORTANTE)

createApp(App)
  .use(router)
  .use(vuetify)
  .mount('#app')
