import request from '@/utils/request'

// 查询renwuone列表
export function listRenwuone(query) {
    return request({
        url: '/renwu/renwuone/list',
        method: 'get',
        params: query
    })
}

// 查询renwuone详细
export function getRenwuone(rwpcid) {
    return request({
        url: '/renwu/renwuone/' + rwpcid,
        method: 'get'
    })
}

// 新增renwuone
export function addRenwuone(data) {
    return request({
        url: '/renwu/renwuone',
        method: 'post',
        data: data
    })
}

// 修改renwuone
export function updateRenwuone(data) {
    return request({
        url: '/renwu/renwuone',
        method: 'put',
        data: data
    })
}

// 删除renwuone
export function delRenwuone(rwpcid) {
    return request({
        url: '/renwu/renwuone/' + rwpcid,
        method: 'delete'
    })
}

// 导出renwuone
export function exportRenwuone(query) {
    return request({
        url: '/renwu/renwuone/export',
        method: 'get',
        params: query
    })
}

//全明细
export function getQuanmx(query) {
    return request({
        url: 'renwu/JYMX/list',
        method: 'get',
        params: query
    })
}
///renwu/xgzlxm/list
export function getXgzlxm(query) {
    return request({
        url: 'renwu/xgzlxm/list',
        method: 'get',
        params: query
    })
}