<template>
  <div style="height:100%;width:100%">
    <div id="video-stream-resources" class="className" style="height:50%;width:50%;display: inline-block;float: left;"/>
    <div id="video-disk-resources" class="className" style="height:50%;width:50%;display:inline-block;float: left"/>
    <div id="video-transform-resources" class="className"
         style="height:50%;width:50%;display:inline-block;float: left"/>
    <div id="oss-resources" class="className" style="height:50%;width:50%;display:inline-block;float: left"/>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import resize from './mixins/resize'
import dashboardApi from '@/api/dashboard/dashboard'

export default {
  mixins: [resize],
  data() {
    return {
      videoStream: null,
      videoDisk: null,
      videoTransform: null,
      OSSResources: null,
      oneYearData: {},
      videoStreamValue: 0,
      videoDiskValue: 0,
      videoTransformValue: 0,
      OSSResourcesValue: 0
    }
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    // if (!this.videoStream) {
    //   return
    // }
    this.videoStream.dispose()
    this.videoDisk.dispose()
    this.videoTransform.dispose()
    this.OSSResources.dispose()
    this.videoStream = null
    this.videoDisk = null
    this.videoTransform = null
    this.OSSResources = null
  },
  methods: {
    init() {
      dashboardApi.getCloudResourcesUsage().then(res => {
        if (res.success) {
          const resources = res.data.cloudResources
          this.videoStreamValue = resources.vodStream
          this.videoDiskValue = resources.vodDisk
          this.videoTransformValue = resources.vodTransform
          this.OSSResourcesValue = resources.ossDisk
        } else {
          this.$message({type: 'error', message: res.message})
        }
        this.initChart()
      })
    },
    initChart() {
      const _this = this
      this.videoStream = echarts.init(document.getElementById('video-stream-resources'))
      this.videoDisk = echarts.init(document.getElementById('video-disk-resources'))
      this.videoTransform = echarts.init(document.getElementById('video-transform-resources'))
      this.OSSResources = echarts.init(document.getElementById('oss-resources'))
      // 流量带宽用量
      this.videoStream.setOption({
        // backgroundColor: '#344b58',
        tooltip: {
          formatter: '{a} <br/>{b} : {c}%'
        },
        series: [
          {
            name: '流量剩余',
            type: 'gauge',
            progress: {
              show: true
            },
            detail: {
              valueAnimation: true,
              formatter: '{value}%'
            },
            data: [
              {
                value: _this.videoStreamValue,
                name: '流量剩余'
              }
            ]
          }
        ]
      })
      // 存储用量
      this.videoDisk.setOption({
        // backgroundColor: '#344b58',
        tooltip: {
          formatter: '{a} <br/>{b} : {c}%'
        },
        series: [
          {
            name: '视频存储剩余',
            type: 'gauge',
            progress: {
              show: true
            },
            detail: {
              valueAnimation: true,
              formatter: '{value}%'
            },
            data: [
              {
                value: _this.videoDiskValue,
                name: '视频存储剩余'
              }
            ]
          }
        ]
      })
      // 视频转码用量
      this.videoTransform.setOption({
        // backgroundColor: '#344b58',
        tooltip: {
          formatter: '{a} <br/>{b} : {c}%'
        },
        series: [
          {
            name: '视频转码剩余',
            type: 'gauge',
            progress: {
              show: true
            },
            detail: {
              valueAnimation: true,
              formatter: '{value}%'
            },
            data: [
              {
                value: _this.videoTransformValue,
                name: '转码剩余'
              }
            ]
          }
        ]
      })
      // OSS对象存储用量
      this.OSSResources.setOption({
        // backgroundColor: '#344b58',
        tooltip: {
          formatter: '{a} <br/>{b} : {c}%'
        },
        series: [
          {
            name: 'OSS存储剩余',
            type: 'gauge',
            progress: {
              show: true
            },
            detail: {
              valueAnimation: true,
              formatter: '{value}%'
            },
            data: [
              {
                value: _this.OSSResourcesValue,
                name: 'OSS存储剩余'
              }
            ]
          }
        ]
      })
    }
  }
}
</script>
