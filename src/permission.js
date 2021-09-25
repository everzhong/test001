import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import { getToken, getUid, removeToken } from '@/utils/auth'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/authLogin', '/loginapi', '/api/sendscreening', '/auth-redirect', '/bind', '/register']


router.beforeEach((to, from, next) => {
    const uid = getUid()
    const urlUid = to.query.uid
    NProgress.start()
    if (urlUid && uid !== urlUid) {
        removeToken()
    }
    if (getToken()) { //has token
        /* has token*/
        if (to.path === '/login') {
            next()
            NProgress.done()
        } else {
            if (store.getters.roles.length === 0) {
                // 判断当前用户是否已拉取完user_info信息
                store.dispatch('GetInfo').then((res) => {
                    const roles = res.roles;
                    store.dispatch('GenerateRoutes').then(accessRoutes => {
                        router.addRoutes(accessRoutes) // 动态添加可访问路由表
                        if (roles.indexOf('jigou') > -1) {
                            next({ path: '/checkup/listjg', replace: true })
                        } else if (roles.indexOf('xianchangjc') > -1 || roles.indexOf('jiancha') > -1) {
                            next({ path: '/checkup/dayintz', replace: true })
                        } else {
                            next(to.path ? {...to, replace: true } : { path: '/renwu/renwulist', replace: true }) // hack方法 确保addRoutes已完成
                        }
                    })
                }).catch(err => {
                    store.dispatch('LogOut').then(() => {
                        Message.error(err)
                        next({ path: '/' })
                    })
                })
            } else {
                next()
            }
        }
    } else {
        // 没有token
        if (whiteList.indexOf(to.path) !== -1) {
            // 在免登录白名单，直接进入
            next()
                // NProgress.done()
        } else {
            next(`/authLogin?redirect=${to.fullPath}`) // 否则全部重定向到登录页
            NProgress.done()
        }
    }
})

router.afterEach(() => {
    NProgress.done()
})