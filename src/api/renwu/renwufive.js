import request from '@/utils/request'

// 查询renwufive列表
export function listRenwufive(query) {
  return request({
    url: '/renwu/renwufive/list',
    method: 'get',
    params: query
  })
}

// 查询renwufive详细
export function getRenwufive(id) {
  return request({
    url: '/renwu/renwufive/' + id,
    method: 'get'
  })
}

// 新增renwufive
export function addRenwufive(data) {
  return request({
    url: '/renwu/renwufive',
    method: 'post',
    data: data
  })
}

// 修改renwufive
export function updateRenwufive(data) {
  return request({
    url: '/renwu/renwufive',
    method: 'put',
    data: data
  })
}

// 删除renwufive
export function delRenwufive(id) {
  return request({
    url: '/renwu/renwufive/' + id,
    method: 'delete'
  })
}

// 导出renwufive
export function exportRenwufive(query) {
  return request({
    url: '/renwu/renwufive/export',
    method: 'get',
    params: query
  })
}