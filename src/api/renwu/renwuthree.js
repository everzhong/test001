import request from '@/utils/request'

// 查询renwuthree列表
export function listRenwuthree(query) {
  return request({
    url: '/renwu/renwuthree/list',
    method: 'get',
    params: query
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