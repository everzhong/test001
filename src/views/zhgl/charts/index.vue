<template>
  <div class="dashboard-editor-container">
    <div class="search">
      <!-- <el-input clearable placeholder="支持信息标题、信息标题关键字搜索" style="width:500px;margin-right:10px" v-model="fileName" size="small"></el-input> -->
      <el-date-picker
        ref="monthrange"
        v-model="checkDate"
        type="monthrange"
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        unlink-panels
        :clearable="false"
        :picker-options="pickerOptions"
       >
      </el-date-picker>
      <el-button style="margin-left:15px" slot="append" icon="el-icon-search" type="primary" size="small" @click="getChartData">搜索</el-button>
      <el-button slot="append" type="primary" size="small" plain @click="resetSearch">重置</el-button>

    </div>
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="12">
        <!-- <div class="chart-wrapper">
          <pie-chart />
        </div> -->
        <div class="chart-wrapper">
          <el-tabs type="border-card" v-loading="loading1">
            <el-tab-pane label="就诊类型">
              <pie-chart v-if="chart1Data.length" :seriesData="chart1Data"/>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <el-tabs type="border-card" v-loading="loading2">
            <el-tab-pane label="规则分类">
              <bar-chart v-if="chart2Data.label.length" :seriesData="chart2Data"/>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <el-tabs type="border-card" v-loading="loading3" v-model="chart5Value">
            <el-tab-pane label="结算等级" name="1" >
                <pie-chart v-if="chart5Data.length" :seriesData="chart5Data"/>
            </el-tab-pane>
            <el-tab-pane label="医疗机构" name="2" style="text-align:right">
              <label style="font-size:14px;color:#666">结算等级 &nbsp;</label><el-select @change="handelJsdjChange" v-model="jsdj" placeholder="结算等级" size="mini" style="width:100px;">
                <el-option
                  v-for="item in jsdjOptions"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue">
                </el-option>
              </el-select>
                <bar-chart v-if="chart5Value==='2' && chart3Data.label.length" :seriesData="chart3Data"/>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <el-tabs type="border-card" v-loading="loading4">
            <el-tab-pane label="调查单位">
              <bar-chart v-if="chart4Data.label.length" :seriesData="chart4Data"/>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import PanelGroup from './dashboard/PanelGroup'
import LineChart from './dashboard/LineChart'
import RaddarChart from './dashboard/RaddarChart'
import PieChart from './dashboard/PieChart'
import BarChart from './dashboard/BarChart'
import {getTjjzlx1,getTjjzlx2,getTjjzlx3,getTjjzlx4,getTjjzlx5} from '@/api/renwu/renwufour.js'
const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  name: 'Index',
  components: {
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart
  },
  
  data() {
    return {
      checkDate:null,
      loading1:false,
      loading2:false,
      loading3:false,
      loading4:false,
      chart5Value:'1',
      jsdj:'1',
      jsdjOptions:[],
      pickerOptions:{
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6
        },
        shortcuts: [{
            text: '最近六个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setMonth(start.getMonth() - 6);
              picker.$emit('pick', [start, end]);
            }
          },{
            text: '最近九个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setMonth(start.getMonth() - 9);
              picker.$emit('pick', [start, end]);
            }
          },{
            text: '最近一年',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setMonth(start.getMonth() - 12);
              picker.$emit('pick', [start, end]);
            }
          },{
            text: '今年至今',
            onClick(picker) {
              const end = new Date();
              const start = new Date(new Date().getFullYear(), 0);
              this.checkDate = [start, end]
              picker.$emit('pick', [start, end]);
            }
          },]
      },
      lineChartData: lineChartData.newVisitis,
      chart1Data:[],
      chart2Data:{
        label:[]
      },
      chart3Data:{
        label:[]
      },
      chart4Data:{
        label:[]
      },
      chart5Data:[],
    }
  },
  created(){
    this.jsdjOptions = this.$store.getters.jsdjDic
    this.resetDate()
    this.getChartData()
  },
  methods: {
    getQuery(){
      // const query = {
      //   stime:this.parseTime(this.checkDate[0].getTime(),'{y}-{m}'),
      //   etime:this.parseTime(this.checkDate[1].getTime(),'{y}-{m}')
      // }
      return {}
    },
    handelJsdjChange(){
      this.getChart3()
    },
    getChartData() {
      this.getChart1()
      this.getChart2()
      this.getChart3()
      this.getChart4()
      this.getChart5()
    },
    
    resetSearch(){
      this.resetDate()
      this.getChartData()
    },
    resetDate(){
      const end = new Date();
      const start = new Date();
      start.setMonth(start.getMonth() - 6);
      this.checkDate = [start, end]
    },
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
    async getChart1(){
      const query = this.getQuery()
      this.loading1 = true
      const res = await getTjjzlx1(query)
      if(res.code===200){
        const sdata = []
        res.rows.forEach(element => {
          const obj = [
            {value: element?.mxxmbjsfy*1||0, name: '疑点费用' },
            { value: element?.wgfy*1||0, name: '认定费用' },
            { value: element?.xjjzrs*1||0, name: '人次' }
          ]
          switch(element.jslb) {
            case '0101':
              sdata[0]={
                label:'住院',
                data:obj
              }
              break;
            case '0102':
              sdata[1]={
                label:'门诊',
                data:obj
              }
              break;
            case '0107':
              sdata[2]={
                label:'内设',
                data:obj
              }
              break;
            default:
              break;
          }
          this.chart1Data = sdata
        });
      }
      this.loading1 = false
    },
    async getChart2(){
      const query = this.getQuery()
      this.loading2 = true
      const res = await getTjjzlx2(query)
      if(res.code===200){
        const gzfl = res.rows.map(item=>item.gzfl)
        const sdata = {
          label:gzfl,
          data:[[],[],[]]
        }
        res.rows.forEach(element => {
          // const obj = [
          //   {value: element?.mxxmbjsfy*1||0, name: '疑点费用' },
          //   { value: element?.wgfy*1||0, name: '认定费用' },
          //   { value: element?.xjjzrs*1||0, name: '人次' }
          // ]
          sdata.data[0].push(element?.mxxmbjsfy*1||0)
          sdata.data[1].push(element?.wgfy*1||0)
          sdata.data[2].push(element?.xjjzrs*1||0)
          this.chart2Data = sdata
        });
      }
      this.loading2 = false
    },
    async getChart3(){
      const query = this.getQuery()
      this.loading3= true
      const res = await getTjjzlx3(query)
      if(res.code===200){
        const jgmc = res.rows.map(item=>item.jgmc)
        const sdata = {
          label:jgmc,
          data:[[],[],[]]
        }
        res.rows.forEach(element => {
          sdata.data[0].push(element?.mxxmbjsfy*1||0)
          sdata.data[1].push(element?.wgfy*1||0)
          sdata.data[2].push(element?.xjjzrs*1||0)
          this.chart3Data = sdata
        });
      }
      this.loading3 = false
    },
    async getChart4(){
      const query = this.getQuery()
      this.loading4 = true
      const res = await getTjjzlx4(query)
      if(res.code===200){
        const xm = res.rows.map(item=>item.xm)
        const sdata = {
          label:xm,
          data:[[],[],[]]
        }
        res.rows.forEach(element => {
          sdata.data[0].push(element?.mxxmbjsfy*1||0)
          sdata.data[1].push(element?.wgfy*1||0)
          sdata.data[2].push(element?.xjjzrs*1||0)
          this.chart4Data = sdata
        });
      }
      this.loading4 = false
    },
    async getChart5(){
      const query = this.getQuery()
      this.loading3 = true
      const res = await getTjjzlx5({...query,jsdj:this.jsdj})
      if(res.code===200){
        const sdata = []
        res.rows.forEach(element => {
          const obj = [
            {value: element?.mxxmbjsfy*1||0, name: '疑点费用' },
            { value: element?.wgfy*1||0, name: '认定费用' },
            { value: element?.xjjzrs*1||0, name: '人次' }
          ]
          switch(element.jsdj*1) {
            case 1:
              sdata[0]={
                label:'一级',
                data:obj
              }
              break;
            case 2:
              sdata[1]={
                label:'二级',
                data:obj
              }
              break;
            case 3:
              sdata[2]={
                label:'三级',
                data:obj
              }
              break;
            default:
              break;
          }
        })
        this.chart5Data = sdata
      }
      this.loading3 = false
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 15px 30px;
  background-color: rgb(240, 242, 245);
  position: relative;
  .search {
    margin-bottom: 15px;
  }
  .chart-wrapper {
    background: #fff;
    margin-bottom: 20px;
  }
}
</style>
