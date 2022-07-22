import request from '@/utils/request'
export default {
  getAuthorListPage(curent, size, authorQuery) {
    return request({
      url: `/service_video/author/pageList/${curent}/${size}`,
      method: 'post',
      data: authorQuery
    })
  }

}
