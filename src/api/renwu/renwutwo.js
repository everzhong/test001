import request from '@/utils/request'

// 查询renwutwo列表
export function listRenwutwo(query) {
    return request({
        url: '/renwu/renwutwo/list',
        method: 'get',
        params: query
    })
}

// 查询renwutwo详细
export function getRenwutwo(ybd) {
    return request({
        url: '/renwu/renwutwo/' + ybd,
        method: 'get'
    })
}

// 新增renwutwo
export function addRenwutwo(data) {
    return request({
        url: '/renwu/renwutwo',
        method: 'post',
        data: data
    })
}

// 修改renwutwo
export function updateRenwutwo(data) {
    return request({
        url: '/renwu/renwutwo',
        method: 'put',
        data: data
    })
}

// 删除renwutwo
export function delRenwutwo(ids) {
    return request({
        url: '/renwu/renwutwo/' + ids,
        method: 'delete'
    })
}

// 导出renwutwo
export function exportRenwutwo(query) {
    return request({
        url: '/renwu/renwutwo/export',
        method: 'get',
        params: query
    })
}
// 提交网审查
export function submitNetCheck(data) {
    const { ids } = data
    delete data.ids
    return request({
        url: '/renwu/renwutwo/setws/' + ids,
        method: 'post',
        data: data
    })
}

// 批量派发检查组
export function submitJcz(data) {
    const { ids } = data
    delete data.ids
    return request({
        url: '/renwu/renwutwo/setjcz/' + ids,
        method: 'post',
        data: data
    })
}