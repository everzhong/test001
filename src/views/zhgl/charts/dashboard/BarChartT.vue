<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

const animationDuration = 6000

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    seriesData: {
      type:Object,
      default(){
        return {
          label:[],
          data:[]
        }
      }
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.setOption({
        color:['#1b65b9','#91cc75'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter:function(params){
            let str = params[0].name||''
            params.forEach(element => {
              str+= "<br/>"+element.marker+element.seriesName+'：'+element.value+'(万元)'
            })
            return str
          }
        },
        legend: {
          bottom: '2',
        },
        grid: {
          top: "10%",
          left: '2%',
          right: '2%',
          bottom: '13%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: this.seriesData?.label||[],
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          name:'(万)',
          type: 'value',
          axisTick: {
            show: false
          }
        }],
        series: [{
          name: '疑点费用',
          type: 'bar',
          stack: 'vistors',
          barWidth: '50%',
          data: this.seriesData?.data[0]||[],
          animationDuration
        }, {
          name: '认定费用',
          type: 'bar',
          stack: 'vistors',
          barWidth: '50%',
          data: this.seriesData?.data[1]||[],
          animationDuration
        }]
      })
    }
  },
  watch: {
    seriesData(){
      this.chart.dispose()
      this.chart = null
      this.initChart()
    }
  }
}
</script>
