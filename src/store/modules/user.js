import { login, logout, getInfo, loginApi } from '@/api/login'
import { getToken, setToken, removeToken, setUid } from '@/utils/auth'
// import axios from 'axios'
const user = {
    state: {
        token: getToken(),
        name: '',
        avatar: '',
        roles: [],
        permissions: [],
        remark: ''
    },

    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_NAME: (state, name) => {
            state.name = name
        },
        SET_REMARK: (state, remark) => {
            state.remark = remark
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles
        },
        SET_PERMISSIONS: (state, permissions) => {
            state.permissions = permissions
        }
    },

    actions: {
        // LoginApi({ commit }, userInfo) {
        //     const uid = userInfo.uid
        //     return new Promise((resolve, reject) => {
        //         axios.get('http://211.149.254.6:8080/loginapi', {
        //             params: { uid }
        //         }).then(res => {
        //             setToken(res.data.token)
        //             setUid(uid)
        //             commit('SET_TOKEN', res.data.token)
        //             resolve()
        //         }).catch(error => {
        //             reject(error)
        //         })
        //     })
        // },
        LoginApi({ commit }, userInfo) {
            const uid = userInfo.uid
            return new Promise((resolve, reject) => {
                loginApi({ uid }).then(res => {
                    setToken(res.token)
                    setUid(uid)
                    commit('SET_TOKEN', res.token)
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 登录
        Login({ commit }, userInfo) {
            const username = userInfo.username.trim()
            const password = userInfo.password
            const code = userInfo.code
            const uuid = userInfo.uuid
            return new Promise((resolve, reject) => {
                login(username, password, code, uuid).then(res => {
                    setToken(res.token)
                    commit('SET_TOKEN', res.token)
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 获取用户信息
        GetInfo({ commit, state }) {
            return new Promise((resolve, reject) => {
                getInfo().then(res => {
                    const user = res.user
                    const avatar = user.avatar == "" ? require("@/assets/images/profile.jpg") : process.env.VUE_APP_BASE_API + user.avatar;
                    if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
                        commit('SET_ROLES', res.roles)
                        commit('SET_PERMISSIONS', res.permissions)
                    } else {
                        commit('SET_ROLES', ['ROLE_DEFAULT'])
                    }
                    commit('SET_REMARK', user.remark)
                    commit('SET_NAME', user.userName)
                    commit('SET_AVATAR', avatar)
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 退出系统
        LogOut({ commit, state }) {
            return new Promise((resolve, reject) => {
                logout(state.token).then(() => {
                    commit('SET_TOKEN', '')
                    commit('SET_ROLES', [])
                    commit('SET_PERMISSIONS', [])
                    removeToken()
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 前端 登出
        FedLogOut({ commit }) {
            return new Promise(resolve => {
                commit('SET_TOKEN', '')
                removeToken()
                resolve()
            })
        },
        // 登录前执行清空
        ClearInfo({ commit }) {
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            commit('SET_PERMISSIONS', [])
            removeToken()
        },
    }
}

export default user