import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/article/list',
    method: 'get',
    params: query,
    baseURL: 'http://127.0.0.1:5000/' // 直接通过覆盖的方式
  })
}
