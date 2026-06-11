import { createApp } from 'vue'
import Antd from 'ant-design-vue'
import App from './App'
import 'ant-design-vue/dist/reset.css'
import 'normalize.css'
import 'virtual:svg-icons-register'
import './assets/css/index.scss'
import router from './router'
import store from './store'
import SvgIcon from '@/components/SvgIcon/index.vue'
import AntIcon from '@/components/SvgIcon/antIcon'

const app = createApp(App)

app.use(AntIcon)
app.component('SvgIcon', SvgIcon)
app.use(Antd)
app.use(router)
app.use(store)
app.mount('#app')
