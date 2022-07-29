import request from '@/utils/request'

const api_name = '/service_vod/vod'

export default {

  deleteVodById(id) {
    return request({
      url: `${api_name}/deleteWithId/${id}`,
      method: 'post'
    })
  }

}
