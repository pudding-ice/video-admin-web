import request from '@/utils/request'

export default {
  getCategoryTree() {
    return request({
      url: `/service_video/category/getCategoryTree`,
      method: 'get'
    })
  },
  getAuthorList() {
    return request({
      url: `/service_video/author/getAllAuthor`,
      method: 'get'
    })
  },
  sentContentData(contentChapterVO) {
    return request({
      url: `/service_video/content/saveContentData`,
      method: 'post',
      data: contentChapterVO
    })
  }
}
