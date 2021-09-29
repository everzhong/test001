import { getDicts } from "@/api/system/dict/data";
// import axios from 'axios'
const user = {
    state: {
        fylbOptions:[]
    },

    mutations: {
      SET_FYLBOPTIONS:(state,list) => {
        state.fylbOptions = list
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
      }
    }
}

export default user