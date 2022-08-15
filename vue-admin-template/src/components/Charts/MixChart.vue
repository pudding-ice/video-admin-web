<template>
  <div :id="id" :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import * as echarts from 'echarts'
import resize from './mixins/resize'
import dashboardApi from '@/api/dashboard/dashboard'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    }
  },
  data() {
    return {
      chart: null,
      year: 2022,
      oneYearData: {}
    }
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    async initChart() {
      let oneYearData = {}
      await dashboardApi.getOneYearPlayUserTotalCurrently(this.year).then(res => {
        this.oneYearData = res.data.totalYear
        oneYearData = res.data.totalYear
        console.log(this.oneYearData)
      })
      const getVideoPlayCount = (function () {
        const videoPlayCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        const total = oneYearData.playUserTotal
        for (let i = 0; i < total.length; i++) {
          const index = total[i].month - 1
          videoPlayCount[index] = total[i].totalPlayVideo
        }
        return videoPlayCount
      }())
      const getUserPlayCount = (function () {
        const userPlayCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        const total = oneYearData.playUserTotal
        for (let i = 0; i < total.length; i++) {
          const index = total[i].month - 1
          userPlayCount[index] = total[i].totalPlayUser
        }
        return userPlayCount
      }())
      const getVideoPlayDuration = (function () {
        const videoPlayDuration = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        const total = oneYearData.playUserTotal
        for (let i = 0; i < total.length; i++) {
          const index = total[i].month - 1
          const min = parseInt(total[i].playDuration / 1000 / 60)
          videoPlayDuration[index] = min
        }
        return videoPlayDuration
      }())
      this.chart = echarts.init(document.getElementById(this.id))
      const xData = (function () {
        const data = []
        for (let i = 1; i < 13; i++) {
          data.push(i + '月')
        }
        return data
      }())
      this.chart.setOption({
        backgroundColor: '#344b58',
        encoding: 'utf8',
        title: {
          text: '视频播放统计',
          x: '20',
          top: '20',
          textStyle: {
            color: '#fff',
            fontSize: '22'
          },
          subtextStyle: {
            color: '#90979c',
            fontSize: '16'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            textStyle: {
              color: '#fff'
            }
          }
        },
        grid: {
          left: '5%',
          right: '5%',
          borderWidth: 0,
          top: 150,
          bottom: 95,
          textStyle: {
            color: '#fff'
          }
        },
        legend: {
          x: '5%',
          top: '10%',
          textStyle: {
            color: '#90979c'
          },
          data: ['播放次数', '播放用户数', '播放总时长(分钟)']
        },
        calculable: true,
        xAxis: [{
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitArea: {
            show: false
          },
          axisLabel: {
            interval: 0
          },
          data: xData
        }],
        yAxis: [{
          type: 'value',
          scale: true, /* 按比例显示*/
          min: (value) => {
            return value.min
          },
          max: (value) => {
            return value.max
          },
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 0
          },
          splitArea: {
            show: false
          }
        }],
        dataZoom: [{
          show: true,
          height: 30,
          xAxisIndex: [
            0
          ],
          bottom: 30,
          start: 10,
          end: 80,
          handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
          handleSize: '110%',
          handleStyle: {
            color: '#d3dee5'

          },
          textStyle: {
            color: '#fff'
          },
          borderColor: '#90979c'

        }, {
          type: 'inside',
          show: true,
          height: 15,
          start: 1,
          end: 35
        }],
        series: [
          {
            name: '播放次数',
            type: 'bar',
            stack: 'total',
            barMaxWidth: 35,
            barGap: '10%',
            itemStyle: {
              normal: {
                color: 'rgba(255,144,128,1)',
                label: {
                  show: true,
                  textStyle: {
                    color: '#fff'
                  },
                  position: 'insideTop',
                  formatter(p) {
                    return p.value > 0 ? p.value : ''
                  }
                }
              }
            },
            data: getVideoPlayCount
          },
          {
            name: '播放用户数',
            type: 'bar',
            stack: 'total',
            itemStyle: {
              normal: {
                color: 'rgba(0,191,183,1)',
                barBorderRadius: 0,
                label: {
                  show: true,
                  position: 'top',
                  formatter(p) {
                    return p.value > 0 ? p.value : ''
                  }
                }
              }
            },
            data: getUserPlayCount
          },
          {
            name: '播放总时长(分钟)',
            type: 'line',
            stack: 'total',
            symbolSize: 10,
            position: 'button',
            symbol: 'circle',
            silent: true,
            itemStyle: {
              normal: {
                color: 'rgba(252,230,48,1)',
                barBorderRadius: 0,
                label: {
                  show: true,
                  position: 'top',
                  formatter(p) {
                    return p.value > 0 ? p.value : ''
                  }
                }
              }
            },
            data: getVideoPlayDuration
          }
        ]
      })
    }
  }
}
</script>
