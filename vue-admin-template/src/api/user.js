import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/service_auth/admin/index/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/service_auth/admin/index/info',
    method: 'get',
    params: {token}
  })
}

export function logout() {
  return request({
    url: '/service_auth/admin/index/logout',
    method: 'post'
  })
}

// 根据用户权限获取菜单
export function getMenuRouter() {
  return request({
    url: '/service_auth/admin/index/menu',
    method: 'get'
  })
}
