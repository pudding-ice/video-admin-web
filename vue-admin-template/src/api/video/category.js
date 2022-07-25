import request from '@/utils/request'
export default {
  getCategoryTree(templateName, type) {
    return request({
      url: `/service_video/category/getCategoryTree`,
      method: 'get'
    })
  }
}

