import request from '@/utils/request'

// 查询数据抽取日志列表
export function listLog(query) {
  return request({
    url: '/renwu/log/list',
    method: 'get',
    params: query
  })
}

// 查询数据抽取日志详细
export function getLog(id) {
  return request({
    url: '/renwu/log/' + id,
    method: 'get'
  })
}

// 新增数据抽取日志
export function addLog(data) {
  return request({
    url: '/renwu/log',
    method: 'post',
    data: data
  })
}

// 修改数据抽取日志
export function updateLog(data) {
  return request({
    url: '/renwu/log',
    method: 'put',
    data: data
  })
}

// 删除数据抽取日志
export function delLog(id) {
  return request({
    url: '/renwu/log/' + id,
    method: 'delete'
  })
}

// 导出数据抽取日志
export function exportLog(query) {
  return request({
    url: '/renwu/log/export',
    method: 'get',
    params: query
  })
}