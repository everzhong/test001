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
      <el-button slot="append" type="primary" size="small"  @click="resetSearch">重置</el-button>

    </div>
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="12">
        <!-- <div class="chart-wrapper">
          <pie-chart />
        </div> -->
        <div class="chart-wrapper">
          <el-tabs type="border-card" v-loading="loading1">
            <el-tab-pane label="就诊类型">
              <div class="chart-title">
                <span v-for="item in chart1Data" :key="item.label">{{item.label}}</span>
              </div>
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
                <bar-chart-t v-if="chart5Data.label.length" :seriesData="chart5Data"/>
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
              <bar-chart-t v-if="chart4Data.label.length" :seriesData="chart4Data"/>
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
import BarChartT from './dashboard/BarChartT'
import {getTjjzlx1,getTjjzlx2,getTjjzlx3,getTjjzlx4,getTjjzlx5} from '@/api/renwu/renwufour.js'

export default {
  name: 'Index',
  components: {
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
    BarChartT
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
      chart5Data:{
        label:[]
      },
    }
  },
  created(){
    this.jsdjOptions = this.$store.getters.jsdjDic
    this.resetDate()
    this.getChartData()
  },
  methods: {
    getQuery(){
      const query = {
        stime:this.parseTime(this.checkDate[0].getTime(),'{y}-{m}'),
        etime:this.parseTime(this.checkDate[1].getTime(),'{y}-{m}')
      }
      return query
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
    async getChart1(){
      const query = this.getQuery()
      this.loading1 = true
      try {
         const res = await getTjjzlx1(query)
        if(res.code===200){
          const sdata = [
             {
              label:'人次',
              data:[]
            },
            {
              label:'疑点费用',
              data:[]
            },
            {
              label:'认定费用',
              data:[]
            },
          ]
          res.rows.forEach(element => {
            let name = element.jslb === '0101'? '住院':element.jslb ==='0102'?'门诊':element.jslb ==='0107'?'内设':''
            sdata[0]['data'].push({
              value: ((element?.xjjzrs*1||0)/10000).toFixed(3), 
              name
            })
            sdata[1]['data'].push({
              value: ((element?.mxxmbjsfy*1||0)/10000).toFixed(3), 
              name
            })
            sdata[2]['data'].push({
              value: ((element?.wgfy*1||0)/10000).toFixed(3), 
              name
            })
          });
          console.log(sdata,78)
          this.chart1Data = sdata

        }
      } catch (error) {
        console.log(error)
      }
      this.loading1 = false
    },
    async getChart2(){
      const query = this.getQuery()
      this.loading2 = true
      try {
        const res = await getTjjzlx2(query)
        if(res.code===200){
          var gzfl = res.rows.map(item=>{
            const fl = item.gzfl? item.gzfl.trim():''
            return fl.split('-').pop()
          })
          const sdata = {
            label:gzfl,
            data:[[],[]]
          }
          res.rows.forEach(element => {
            const jsfy = element?.mxxmbjsfy*1||0
            const wgfy = element?.wgfy*1||0

            sdata.data[0].push((jsfy/10000).toFixed(3))
            sdata.data[1].push((wgfy/10000).toFixed(3))
          });
          this.chart2Data = sdata
        }
      } catch (error) {
        console.log(error)
      }
      this.loading2 = false
    },
    async getChart3(){
      const query = this.getQuery()
      this.loading3= true
      try {
        const res = await getTjjzlx3(query)
        if(res.code===200){
          const jgmc = res.rows.map(item=>item.jgmc.trim())
          const sdata = {
            label:jgmc,
            data:[[],[]]
          }
          res.rows.forEach(element => {
            const jsfy = element?.mxxmbjsfy*1||0
            const wgfy = element?.wgfy*1||0
            sdata.data[0].push((jsfy/10000).toFixed(3))
            sdata.data[1].push((wgfy/10000).toFixed(3))
          });
          this.chart3Data = sdata
        }
      } catch (error) {
        console.log(error)
      }
      this.loading3 = false
    },
    async getChart4(){
      const query = this.getQuery()
      this.loading4 = true
      try {
        const res = await getTjjzlx4(query)
        if(res.code===200){
          const xm = res.rows.map(item=>`医生${item.xm}`)
          const sdata = {
            label:xm,
            data:[[],[]]
          }
          res.rows.forEach(element => {
            const jsfy = element?.mxxmbjsfy*1||0
            const wgfy = element?.wgfy*1||0

            sdata.data[0].push((jsfy/10000).toFixed(3))
            sdata.data[1].push((wgfy/10000).toFixed(3))
            
          });
          this.chart4Data = sdata
        }
      } catch (error) {
        console.log(error)
      }
      this.loading4 = false
    },
    async getChart5(){
      const query = this.getQuery()
      this.loading3 = true
      try {
         const res = await getTjjzlx5({...query,jsdj:this.jsdj})
        if(res.code===200){
          let lv1 = res.rows.filter(item=>{
            return item?.jsdj==1
          })
          let lv2 = res.rows.filter(item=>{
            return item?.jsdj==2
          })
          let lv3 = res.rows.filter(item=>{
            return item?.jsdj==3
          })
          !lv1[0] && (lv1=[{}])
          !lv2[0] && (lv2=[{}])
          !lv3[0] && (lv3=[{}])
          const result = [...lv1,...lv2,...lv3]
          const sdata = {
            label:['一级','二级','三级'],
            data:[[],[]]
          }
          result.forEach(item => {
            let element = item?item:{}
            const jsfy = element?.mxxmbjsfy*1||0
            const wgfy = element?.wgfy*1||0
            sdata.data[0].push((jsfy/10000).toFixed(3))
            sdata.data[1].push((wgfy/10000).toFixed(3))
           
          })
          this.chart5Data = sdata
        }
      } catch (error) {
        console.log(error)
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
.chart-title {
  width: 100%;
  left: 1%;
  top: 10%;
  position: absolute;
  display: flex;
  justify-content: space-around;
  color: #1B65B9;
}
::v-deep .el-tab-pane{
  box-sizing: border-box;
}
</style>
