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
  sendContentData(contentChapterVO) {
    return request({
      url: `/service_video/content/saveContentData`,
      method: 'post',
      data: contentChapterVO
    })
  },
  getContentPageList(current, size, searchObj) {
    return request({
      url: `/service_video/content/getContentPageQuery/${current}/${size}`,
      method: 'post',
      data: searchObj
    })
  },
  deleteContentById(id) {
    return request({
      url: `/service_video/content/deleteContent/${id}`,
      method: 'delete'
    })
  },
  updateContentData(contentChapterVO) {
    return request({
      url: `/service_video/content/updateContentData`,
      method: 'post',
      data: contentChapterVO
    })
  },
  getContentDataWithId(id) {
    return request({
      url: `/service_video/content/getContentDataWithId/${id}`,
      method: 'get'
    })
  },
  deleteContentCoverWithName(name) {
    return request({
      url: `/service_video/content/deleteContentCoverWithName/${name}`,
      method: 'get'
    })
  }
}

