import request from '@/utils/request'

const api_name = '/service_video/contentVideo'
export default {
  getVideoInfoById(id) {
    return request({
      url: `${api_name}/getVideoInfoWithId/${id}`,
      method: 'get'
    })
  },
  deleteVideoWithId(videoId) {
    return request({
      url: `${api_name}/deleteVideoWithId/${videoId}`,
      method: 'delete'
    })
  }
}
