import request from '@/utils/request'

// 查询renwufour列表
export function listRenwufour(query) {
    return request({
        url: '/renwu/renwufour/list',
        method: 'get',
        params: query
    })
}
// 查询renwufour列表
export function listRenwufourTab(query) {
    return request({
        url: '/renwu/renwufour/listtab',
        method: 'get',
        params: query
    })
}
// 查询renwufour列表
export function listRenwufourRj(query) {
    return request({
        url: '/renwu/renwufour/listrj',
        method: 'get',
        contentType: 'application/x-www-form-urlencoded;charset=utf-8',
        params: query
    })
}
// 查询renwufour详细
export function getRenwufour(xwrd) {
    return request({
        url: '/renwu/renwufour/' + xwrd,
        method: 'get'
    })
}

// 新增renwufour
export function addRenwufour(data) {
    return request({
        url: '/renwu/renwufour',
        method: 'post',
        data: data
    })
}

// 修改renwufour
export function updateRenwufour(data) {
    return request({
        url: '/renwu/renwufour',
        method: 'put',
        data: data
    })
}

// 删除renwufour
export function delRenwufour(xwrd) {
    return request({
        url: '/renwu/renwufour/' + xwrd,
        method: 'delete'
    })
}

// 导出renwufour
export function exportRenwufour(query) {
    return request({
        url: '/renwu/renwufour/export',
        method: 'get',
        params: query
    })
}
// /listjg  是按违规类型分组  
export function getListjg(query) {
    return request({
        url: '/renwu/renwufour/listjg',
        method: 'get',
        params: query
    })
}
//listjc  是按检查方式分组
export function getListjc(query) {
    return request({
        url: '/renwu/renwufour/listjc',
        method: 'get',
        params: query
    })
}