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
        color:['#1b65b9','#91cc75'],
        tooltip: {
          trigger: 'item',
          formatter:function(params){
            let str = params.seriesName+"<br/>"+params.marker+params.name+'：'+params.value+'(万元)'+'('+params.percent+'%)'
            return str
          }
        },
       
        legend: {
          left: 'center',
          bottom: '10',
          data: ['住院', '门诊']
        },
        series: [
          {
            top: "10%",
            name: this.seriesData[0]?.label||'',
            type: 'pie',
            //roseType: 'radius',
            minAngle:5,
            radius: [0, 80],
            center: ['15%', '40%'],
            data: this.seriesData[0]?.data||[],
            animationEasing: 'cubicInOut',
            animationDuration: 2600,
            label:{
              normal:{
                show:true,
                formatter: '{b}: {d}%',
                position:'inside'
              }
            }
          },
          {
            top: "10%",
            name: this.seriesData[1]?.label||'',
            type: 'pie',
            minAngle:5,
            //roseType: 'radius',
            radius: [0, 80],
            center: ['50%', '40%'],
            data: this.seriesData[1]?.data||[],
            animationEasing: 'cubicInOut',
            animationDuration: 2600,
            label:{
              normal:{
                show:true,
                formatter: '{b}: {d}%',
                position:'inside'

              }
            }
          },
          {
            top: "10%",
            name: this.seriesData[2]?.label||'',
            type: 'pie',
            minAngle:5,
            //roseType: 'radius',
            radius: [0, 80],
            center: ['85%', '40%'],
            data: this.seriesData[2]?.data||[],
            animationEasing: 'cubicInOut',
            animationDuration: 2600,
            label:{
              normal:{
                show:true,
                formatter: '{b}: {d}%',
                position:'inside'
              }
            }
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