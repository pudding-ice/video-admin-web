import request from '@/utils/request'
export default {
  getTemplate(templateName, type) {
    return request({
      url: `/service_upload/download/template/${templateName}/${type}`,
      method: 'get'
    })
  }
}

