import Vue from 'vue'
import 'babel-polyfill'

import Cookies from 'js-cookie'

import Element from 'element-ui'
import './assets/styles/element-variables.scss'
import '@/assets/styles/index.scss' // global css
import '@/assets/styles/ruoyi.scss' // ruoyi css
import 'element-ui/lib/theme-chalk/icon.css'

import App from './App'
import store from './store'
import router from './router'
import permission from './directive/permission'
import './assets/icons' // icon
import './permission' // permission control
import { getDicts } from "@/api/system/dict/data";
import { getConfigKey } from "@/api/system/config";
import { parseTime, resetForm, addDateRange, selectDictLabel, selectDictLabels, download, handleTree, flexColumnWidth, formatMoney, calcTableHeight } from "@/utils/ruoyi";
import Pagination from "@/components/Pagination";
// 自定义表格工具扩展
import RightToolbar from "@/components/RightToolbar"
import vueToPdf from 'vue-to-pdf'

import Print from '@/utils/print' // 注册
import { checkRole } from '@/utils/permission'
import { addJcfl } from '@/api/renwu/jcfl.js' //新增检查履历
import sTable from '@/components/stable.vue'

// import { pageMixin } from '@/utils/pageMixin.js'
// Vue.mixin(pageMixin)

Vue.use(Print)
Vue.use(vueToPdf)

// 全局方法挂载
Vue.prototype.getDicts = getDicts
Vue.prototype.getConfigKey = getConfigKey
Vue.prototype.parseTime = parseTime
Vue.prototype.flexColumnWidth = flexColumnWidth
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels
Vue.prototype.download = download
Vue.prototype.handleTree = handleTree
Vue.prototype.formatMoney = formatMoney
Vue.prototype.checkRole = checkRole
Vue.prototype.calcTableHeight = calcTableHeight
Vue.prototype.addJcfl = function(query) {
    const params = {
        ...query,
        zhczsj: this.parseTime(new Date().getTime()),
        addtime: this.parseTime(new Date().getTime())
    }
    addJcfl(params)
}


Vue.prototype.msgSuccess = function(msg) {
    this.$message({ showClose: true, message: msg, type: "success" });
}

Vue.prototype.msgError = function(msg) {
    this.$message({ showClose: true, message: msg, type: "error" });
}
Vue.prototype.msgWarning = function(msg) {
    this.$message({ showClose: true, message: msg, type: "warning" });
}
Vue.prototype.msgInfo = function(msg) {
    this.$message.info(msg);
}


// 全局组件挂载
Vue.component('Pagination', Pagination)
Vue.component('RightToolbar', RightToolbar)
Vue.component('sTable', sTable)
Vue.use(permission)

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
    size: Cookies.get('size') || 'medium' // set element-ui default size
})

Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})