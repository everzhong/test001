import request from '@/utils/request'

// 查询检查履历列表
export function listJcfl(query) {
  return request({
    url: '/renwu/jcfl/list',
    method: 'get',
    params: query
  })
}

// 查询检查履历详细
export function getJcfl(jglc) {
  return request({
    url: '/renwu/jcfl/' + jglc,
    method: 'get'
  })
}

// 新增检查履历
export function addJcfl(data) {
  return request({
    url: '/renwu/jcfl',
    method: 'post',
    data: data
  })
}

// 修改检查履历
export function updateJcfl(data) {
  return request({
    url: '/renwu/jcfl',
    method: 'put',
    data: data
  })
}

// 删除检查履历
export function delJcfl(jglc) {
  return request({
    url: '/renwu/jcfl/' + jglc,
    method: 'delete'
  })
}

// 导出检查履历
export function exportJcfl(query) {
  return request({
    url: '/renwu/jcfl/export',
    method: 'get',
    params: query
  })
}