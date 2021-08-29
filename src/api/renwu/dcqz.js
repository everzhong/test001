import request from '@/utils/request'

// 查询调查取证列表
export function listDcqz(query) {
    return request({
        url: '/renwu/dcqz/list',
        method: 'get',
        params: query
    })
}

// 查询调查取证详细
export function getDcqz(qzid) {
    return request({
        url: '/renwu/dcqz/' + qzid,
        method: 'get'
    })
}

// 新增调查取证
export function addDcqz(data) {
    return request({
        url: '/renwu/dcqz',
        method: 'post',
        data: data
    })
}

// 修改调查取证
export function updateDcqz(data) {
    return request({
        url: '/renwu/dcqz',
        method: 'put',
        data: data
    })
}

// 删除调查取证
export function delDcqz(qzid) {
    return request({
        url: '/renwu/dcqz/' + qzid,
        method: 'delete'
    })
}
// 导出调查取证
export function exportDcqz(query) {
    return request({
        url: '/renwu/dcqz/export',
        method: 'get',
        params: query
    })
}
// 批量对象确认
export function submitDxqd(data) {
    const { ids } = data
    delete data.ids
    return request({
        url: '/renwu/renwutwo/setqd/' + ids,
        method: 'post',
        data: data
    })
}
//新增行为认定记录
export function rendingAdd(data) {
    return request({
        url: '/renwu/rending',
        method: 'post',
        data: data
    })
}
//查看行为认定记录
export function getRending(data) {
    return request({
        url: '/renwu/rending/list',
        method: 'get',
        params: data
    })
}