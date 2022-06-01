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
          data:[[],[],[]]
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
          axisPointer: {
            // Use axis to trigger tooltip
            type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
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
          left: '3%',
          right: '8%',
          top:'1%',
          bottom: '13%',
          containLabel: true
        },
        xAxis: [{
          name:'(万）',
          type: 'value',
          axisLabel:{
            interval: 0,
            rotate:30
          }
        }],
        yAxis: [{
          type: 'category',
          data: this.seriesData?.label||[],
        }],
        series: [{
          name: '疑点费用',
          type: 'bar',
          stack: 'total',
          barWidth: '60%',
          data: this.seriesData?.data[0]||[],
          animationDuration,
          emphasis: {
            focus: 'series'
          },
        }, {
          name: '认定费用',
          type: 'bar',
          stack: 'total',
          barWidth: '60%',
          data: this.seriesData?.data[1]||[],
          animationDuration,
          emphasis: {
            focus: 'series'
          },
        }]
        // series: [{
        //   name: '疑点费用',
        //   type: 'bar',
        //   stack: 'vistors',
        //   barWidth: '60%',
        //   barMinHeight:7,
        //   data: this.seriesData?.data[0]||[],
        //   animationDuration
        // }, {
        //   name: '认定费用',
        //   type: 'bar',
        //   barMinHeight:7,
        //   stack: 'vistors',
        //   barWidth: '60%',
        //   data: this.seriesData?.data[1]||[],
        //   animationDuration
        // }, {
        //   name: '人次',
        //   type: 'bar',
        //   barMinHeight:7,
        //   stack: 'vistors',
        //   barWidth: '60%',
        //   data: this.seriesData?.data[2]||[],
        //   animationDuration
        // }]
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
