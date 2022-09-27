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
export function listRenwufourhsls(query) {
    return request({
        url: '/renwu/renwufour/listhsls',
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
        url: '/renwu/renwufour/listhz',
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
//listduogz
export function listMutil(data) {
    return request({
        url: '/renwu/renwufour/listduogz',
        method: 'post',
        data: data
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
// /listjg  是按违规类型分组  
export function getListjgDone(query) {
    return request({
        url: '/renwu/renwufour/listjgdone',
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
//listjc  是按检查方式分组
export function getListjcDone(query) {
    return request({
        url: '/renwu/renwufour/listjcdone',
        method: 'get',
        params: query
    })
}
//获取图形数据tjjzlx
export function getTjjzlx1(query) {
    return request({
        url: '/renwu/renwufour/tjjzlx',
        method: 'get',
        params: query
    })
}
export function getTjjzlx2(query) {
    return request({
        url: '/renwu/renwufour/tjjzlx2',
        method: 'get',
        params: query
    })
}
export function getTjjzlx3(query) {
    return request({
        url: '/renwu/renwufour/tjjzlx3',
        method: 'get',
        params: query
    })
}
export function getTjjzlx4(query) {
    return request({
        url: '/renwu/renwufour/tjjzlx4',
        method: 'get',
        params: query
    })
}
export function getTjjzlx5(query) {
    return request({
        url: '/renwu/renwufour/tjjzlx5',
        method: 'get',
        params: query
    })
}

// 查询renwufour列表
export function listRenwufourHs(query) {
    return request({
        url: '/renwu/renwufour/lisths',
        method: 'get',
        params: query
    })
}
// 查询renwufour明细项目编码
export function listXmbm(query) {
    return request({
        url: '/renwu/renwufour/listxmbm',
        method: 'get',
        params: query
    })
}

// 点形成结果金额进去的查询列表
export function listXcjg(query) {
    return request({
        url: '/renwu/renwufour/listxcjg',
        method: 'get',
        params: query
    })
}