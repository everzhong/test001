import { getDicts } from "@/api/system/dict/data";
// import axios from 'axios'
const user = {
    state: {
        fylbOptions: [], //费用类别
        jslbOptions: [], //就医类型
        ybbfOptions: [], //险种
        jsdjOptions: [], //结算等级
    },

    mutations: {
        SET_FYLBOPTIONS: (state, list) => {
            state.fylbOptions = list
        },
        SET_JSLBOPTIONS: (state, list) => {
            state.jslbOptions = list
        },
        SET_YBBFOPTIONS: (state, list) => {
            state.ybbfOptions = list
        },
        SET_JSDJOPTIONS: (state, list) => {
            state.jsdjOptions = list
        }
    },

    actions: {
        GetFyList({ commit }, userInfo) {
            return new Promise((resolve, reject) => {
                getDicts("sys_renwu_fylb").then(res => {
                    commit('SET_FYLBOPTIONS', res.data)
                    resolve()
                }).catch(error => {
                    reject(error)
                });
            })
        },
        GetJsList({ commit }, userInfo) {
            return new Promise((resolve, reject) => {
                getDicts("renwu_ss_jslb").then(res => {
                    commit('SET_JSLBOPTIONS', res.data)
                    resolve()
                }).catch(error => {
                    reject(error)
                });
            })
        },
        GetYbbfList({ commit }, userInfo) {
            return new Promise((resolve, reject) => {
                getDicts("renwu_ss_ybbf").then(res => {
                    commit('SET_YBBFOPTIONS', res.data)
                    resolve()
                }).catch(error => {
                    reject(error)
                });
            })
        },
        GetJsdjList({ commit }, userInfo) {
            return new Promise((resolve, reject) => {
                getDicts("renwu_ss_jgdj").then(res => {
                    commit('SET_JSDJOPTIONS', res.data)
                    resolve()
                }).catch(error => {
                    reject(error)
                });
            })
        }
    }
}

export default user