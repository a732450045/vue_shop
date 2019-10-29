import Vue from 'vue'
// eslint-disable-next-line import/no-duplicates
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// eslint-disable-next-line import/no-duplicates
import { Message } from 'element-ui'
Vue.prototype.$message = Message
Vue.use(Element)
