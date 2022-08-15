import request from '@/utils/request'

export default {
  getUserListPage(curent, size, authorQuery) {
    return request({
      url: `/service_user/user/pageList/${curent}/${size}`,
      method: 'post',
      data: authorQuery
    })
  },
  deleteUserWithId(id) {
    return request({
      url: `/service_user/user/deleteUserWithId/${id}`,
      method: 'delete'
    })
  }
}
