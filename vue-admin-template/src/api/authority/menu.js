import request from '@/utils/request'

const api_name = '/service_auth/admin/menu'

export default {
  /** 获取所有菜单*/
  getNestedTreeList() {
    return request({
      url: `${api_name}/getAllMenu`,
      method: 'get'
    })
  },
  /** 删除菜单*/
  removeById(id) {
    return request({
      url: `${api_name}/removeMenu/${id}`,
      method: 'post'
    })
  },
  /** 保存菜单*/
  saveLevelOne(menu) {
    return request({
      url: `${api_name}/saveMenu`,
      method: 'post',
      data: menu
    })
  },
  /** 更新菜单*/
  update(menu) {
    return request({
      url: `${api_name}/updateMenu`,
      method: 'post',
      data: menu
    })
  },
  /** 根据角色获取菜单*/
  getMenuWithRoleId(roleId) {
    return request({
      url: `${api_name}/getMenuWithRoleId/${roleId}`,
      method: 'get'
    })
  },
  /** 根据角色分配权限*/
  doAssignRoleAuth(roleId, menus) {
    return request({
      url: `${api_name}/doAssignRoleAuth`,
      method: 'post',
      params: {roleId, menus}
    })
  },
  saveMenu(permission) {
    return request({
      url: `${api_name}/savePermission`,
      method: 'post',
      data: permission
    })
  }
}
