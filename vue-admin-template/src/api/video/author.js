import request from '@/utils/request'
export default {
  getAuthorListPage(curent, size, authorQuery) {
    return request({
      url: `/service_video/author/pageList/${curent}/${size}`,
      method: 'post',
      data: authorQuery
    })
  },
  deleteAuthorWithId(id) {
    return request({
      url: `/service_video/author/delete/${id}`, // 路由参数拼接
      method: 'delete'
    })
  },
  // 3.添加
  addAuthor(author) {
    return request({
      url: `/service_video/author/addOne`, // 路由参数拼接
      method: 'post',
      /* data会自动转成json传递到接口当中*/
      data: author
    })
  },

  // 4.根据id查询作者
  getOneAuthor(id) {
    return request({
      url: `/service_video/author/getOne/${id}`, //  //路由参数拼接
      method: 'get'
    })
  },
  updateAuthor(author) {
    return request({
      url: `/service_video/author/update`,
      method: 'post',
      data: author
    })
  }
}
