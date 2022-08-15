import request from '@/utils/request'

export default {
  getOneYearPlayUserTotal(year) {
    return request({
      url: `/service_vod/dashboard/getDescribePlayUserTotalByYear/${year}`,
      method: 'get'
    })
  },
  getOneYearPlayUserTotalCurrently(year) {
    return request({
      url: `/service_vod/dashboard/getDescribePlayUserTotalByYearCurrently/${year}`,
      method: 'get'
    })
  },
  getCloudResourcesUsage() {
    return request({
      url: `/service_vod/dashboard/getCloudResourcesData`,
      method: 'get'
    })
  }
}
