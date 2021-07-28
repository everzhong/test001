import request from '@/utils/request'

// 查询renwuthree列表
export function listRenwuthree(query) {
    return request({
        url: '/renwu/renwuthree/list',
        method: 'get',
        params: query
    })
}
// 查询renwuthree列表
export function listRenwuthreeTab(query) {
    return request({
        url: '/renwu/renwuthree/listtab',
        method: 'get',
        params: query
    })
}
// 查询机构列表
export function listjgRenwuthree(params) {
    return request({
        url: '/renwu/renwuthree/listjg',
        method: 'get',
        params: params
    })
}
// 查询renwuthree详细
export function getRenwuthree(jgdm) {
    return request({
        url: '/renwu/renwuthree/' + jgdm,
        method: 'get'
    })
}

// 新增renwuthree
export function addRenwuthree(data) {
    return request({
        url: '/renwu/renwuthree',
        method: 'post',
        data: data
    })
}

// 修改renwuthree
export function updateRenwuthree(data) {
    return request({
        url: '/renwu/renwuthree',
        method: 'put',
        data: data
    })
}

// 删除renwuthree
export function delRenwuthree(jgdm) {
    return request({
        url: '/renwu/renwuthree/' + jgdm,
        method: 'delete'
    })
}

// 导出renwuthree
export function exportRenwuthree(query) {
    return request({
        url: '/renwu/renwuthree/export',
        method: 'get',
        params: query
    })
}