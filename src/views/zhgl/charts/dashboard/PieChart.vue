<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

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
      type:Array,
      default(){
        return [{
          label:'',
          data:[]
        },{
          label:'',
          data:[]
        },{
          label:'',
          data:[]
        }]
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
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: ['疑点费用', '认定费用', '人次']
        },
        series: [
          {
            name: this.seriesData[0]?.label||'',
            type: 'pie',
            //roseType: 'radius',
            radius: [25, 85],
            center: ['18%', '38%'],
            data: this.seriesData[0]?.data||[],
           
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          },
          {
            name: this.seriesData[1]?.label||'',
            type: 'pie',
            //roseType: 'radius',
            radius: [25, 85],
            center: ['50%', '38%'],
            data: this.seriesData[1]?.data||[],
           
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          },
          {
            name: this.seriesData[2]?.label||'',
            type: 'pie',
            //roseType: 'radius',
            radius: [25, 85],
            center: ['80%', '38%'],
            data: this.seriesData[2]?.data||[],
           
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
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
