import request from '@/utils/request'

// 查询xwrd列表
export function listXwrd(query) {
  return request({
    url: '/renwu/xwrd/list',
    method: 'get',
    params: query
  })
}

// 查询xwrd详细
export function getXwrd(id) {
  return request({
    url: '/renwu/xwrd/' + id,
    method: 'get'
  })
}

// 新增xwrd
export function addXwrd(data) {
  return request({
    url: '/renwu/xwrd',
    method: 'post',
    data: data
  })
}

// 修改xwrd
export function updateXwrd(data) {
  return request({
    url: '/renwu/xwrd',
    method: 'put',
    data: data
  })
}

// 删除xwrd
export function delXwrd(id) {
  return request({
    url: '/renwu/xwrd/' + id,
    method: 'delete'
  })
}

// 导出xwrd
export function exportXwrd(query) {
  return request({
    url: '/renwu/xwrd/export',
    method: 'get',
    params: query
  })
}