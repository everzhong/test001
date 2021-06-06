import request from '@/utils/request'

// 查询renwufour列表
export function listRenwufour(query) {
  return request({
    url: '/renwu/renwufour/list',
    method: 'get',
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