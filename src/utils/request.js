import axios from 'axios'
import { Notification, MessageBox, Message } from 'element-ui'
import { getToken, getUid } from '@/utils/auth'
import errorCode from '@/utils/errorCode'
import Qs from 'qs'
var baseUrl = ''
var innoreError = false
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
axios.defaults.paramsSerializer = (params) => {
    return Qs.stringify(params, { arrayFormat: 'brackets' });
}
if (process.env.NODE_ENV !== 'production') {
    baseUrl = process.env.VUE_APP_BASE_API
}
axios.defaults.baseURL = baseUrl;
var service = axios.create({
        // axios中请求配置有baseURL选项，表示请求URL公共部分
        baseURL: baseUrl,
        // 超时
        timeout: 90000
    })
    // request拦截器
service.interceptors.request.use(config => {
        // 是否需要设置 token
        innoreError = config.innoreError
        const isToken = (config.headers || {}).isToken === false
        if (getToken() && !isToken && !config.noToken) {
            config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
        }
        if (config.contentType) {
            config.headers['ContentType'] = config.contentType
        }
        // get请求映射params参数
        if (config.method === 'get' && config.params) {
            let url = config.url + '?';
            for (const propName of Object.keys(config.params)) {
                const value = config.params[propName];
                var part = encodeURIComponent(propName) + "=";
                if (value !== null && typeof(value) !== "undefined") {
                    if (typeof value === 'object') {
                        for (const key of Object.keys(value)) {
                            let params = propName + '[' + key + ']';
                            var subPart = encodeURIComponent(params) + "=";
                            url += subPart + encodeURIComponent(value[key]) + "&";
                        }
                    } else {
                        url += part + encodeURIComponent(value) + "&";
                    }
                }
            }
            url = url.slice(0, -1);
            config.params = {};
            config.url = url;
        }
        return config
    }, error => {
        console.log(error)
        Promise.reject(error)
    })
    // 响应拦截器
service.interceptors.response.use(res => {
        // 未设置状态码则默认成功状态
        const code = res.data.code || 200;
        // 获取错误信息
        const msg = errorCode[code] || res.data.msg || errorCode['default']
        if (code === 401) {
            let redirectUrl = window.location.origin + '/#/'
            if (window.location.href.split('/#/')[1]) {
                redirectUrl += window.location.href.split('/#/')[1]
            } else {
                redirectUrl += 'login'
            }
            window.parent.postMessage({
                'loginFailed': {
                    'systemName': '第三方监管',
                    'redirectUrl': redirectUrl
                }
            }, '*');
            // const uid = getUid()
            // location.href = `/#/login?uid=${uid}`
            // router.push({ path: '/login', query: { uid } })
            // MessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
            //     confirmButtonText: '重新登录',
            //     cancelButtonText: '取消',
            //     type: 'warning'
            // }).then(() => {
            //     store.dispatch('LogOut').then(() => {
            //         location.href = '/index';

            //     })
            // })
        } else if (code === 500 && !innoreError) {
            Message({
                message: msg,
                type: 'error',
                showClose: true
            })
            return Promise.reject(new Error(msg))
        } else if (code !== 200 && !innoreError) {
            Notification.error({
                title: msg,
                showClose: true
            })
            return Promise.reject('error')
        } else {
            return res.data
        }
    },
    error => {
        let { message } = error;
        if (message == "Network Error") {
            message = "后端接口连接异常";
        } else if (message.includes("timeout")) {
            message = "系统接口请求超时";
        } else if (message.includes("Request failed with status code")) {
            message = "系统接口" + message.substr(message.length - 3) + "异常";
        }
        Message({
            message: message,
            type: 'error',
            duration: 5 * 1000,
            showClose: true
        })
        return Promise.reject(error)
    }
)
var setPort = function(proms = () => {}) {
    let result = null;
    if (process.env.NODE_ENV === 'production' && !axios.defaults.baseURL) {
        result = axios.get('./host.json').then(ports => {
            const apiPort = ports.data.apiPort
            const urlList = location.origin.split(':')
            urlList[2] = apiPort
            service.defaults.baseURL = urlList.join(':')
            axios.defaults.baseURL = urlList.join(':')
            sessionStorage.setItem('sfPort', ports.data.sfPort)
            return proms();
        });
    } else {
        result = proms();
    }
    return result;
}
const $http = {
    axios(config) {
        return setPort(() => service(config))
    }
}
export default $http.axios