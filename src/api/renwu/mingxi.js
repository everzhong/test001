import request from '@/utils/request'
// 查询相关明细列表
export function getXGMX(query) {
    return request({
        url: '/renwu/jdmxb/list',
        method: 'get',
        params: query
    })
}
// 查询同流水号列表
export function getTLS(query) {
    return request({
        url: '/renwu/jdmxb/listpch',
        method: 'get',
        params: query
    })
}
// 查询全明细列表
export function getQMX(query) {
    return request({
        url: '/renwu/JYMXlistse',
        method: 'get',
        params: query
    })
}