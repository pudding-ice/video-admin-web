import request from '@/utils/request'

const apiName = '/service_video/chapter'
export default {
  getChapterTree(contentId) {
    return request({
      url: `${apiName}/getChapterTreeWithContentId/${contentId}`,
      method: 'GET'
    })
  },
  deleteChapterVideoWithChapterId(chapterId) {
    return request({
      url: `${apiName}/deleteChapterVideoWithChapterId/${chapterId}`,
      method: 'delete'
    })
  }
}
