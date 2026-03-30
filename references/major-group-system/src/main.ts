import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './styles/design-token/index.scss'
import './styles/el-theme/index.scss'
import './styles/global.scss'
import App from './App.vue'

const app = createApp(App)
app.use(ElementPlus)
app.mount('#app')
