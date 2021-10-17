<template>
  <div class="jg-table">
    <!-- <el-table
    show-summary
    :summary-method="getSummaries"
    :data="tableData"
    :span-method="objectSpanMethod"
    style="margin-top:10px">
    <el-table-column
      align="center"
      prop="wglx"
      label="适用办法"
      >
    </el-table-column>
    <el-table-column
      align="center"
      prop="xwrd"
      label="行为认定"
    />
    <el-table-column label="门诊" align="center">
      <el-table-column
        align="center"
        prop="tym"
        label="费用（元）"
        >
        <template slot-scope="scope">
          <span @click="viewDetail(scope.row,'门诊')" style="color:#1B65B9;cursor:pointer;">{{scope.row.tym}}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="占比（%）"
        >
        <template slot-scope="scope">
          <span>{{clacPercent(scope.row.tym,scope.row.zkdj)}}</span>
        </template>
      </el-table-column>
    </el-table-column>
    <el-table-column label="住院" align="center">
      <el-table-column
        align="center"
        prop="bz"
        label="费用（元）"
        >
        <template slot-scope="scope">
          <span @click="viewDetail(scope.row,'住院')" style="color:#1B65B9;cursor:pointer;">{{scope.row.bz}}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="占比（%）"
        >
        <template slot-scope="scope">
          <span>{{clacPercent(scope.row.bz,scope.row.zkdj)}}</span>
        </template>
      </el-table-column>
    </el-table-column>
    <el-table-column label="合计" align="center">
      <el-table-column
        align="center"
        prop="xiaoji"
        label="费用（元）"
        >
        <template slot-scope="scope">
          <span @click="viewDetail(scope.row,'')" style="color:#1B65B9;cursor:pointer;">{{scope.row.xiaoji}}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="namePercent"
        label="占比（%）"
        >
        <template slot-scope="scope">
          <span>{{clacPercent(scope.row.bz*1+scope.row.tym*1,scope.row.zkdj)}}</span>
        </template>
      </el-table-column>
    </el-table-column>
    </el-table> -->
    <el-table
      :span-method="objectSpanMethod"
      :data="tableData"
      :cell-style="handelCellStyle"
      style="margin-top: 10px"
    >
      <el-table-column label="适用办法" prop="wglx" align="center" min-width="150px" show-overflow-tooltip></el-table-column>
      <el-table-column label="行为认定" prop="xwrd" align="center" min-width="180px" show-overflow-tooltip> </el-table-column>
      <el-table-column label="门诊" align="center">
        <el-table-column label="费用" prop="tym" align="center">
          <template slot-scope="scope"><span @click="viewDetail(scope.row,'门诊')" style="color:#1B65B9;cursor:pointer;">{{(scope.row.tym*1).toFixed(2)}}</span></template>
        </el-table-column>
        <el-table-column label="占比%" align="center">
          <template slot-scope="scope">
            <span>{{clacPercent(scope.row.tym*1,scope.row.zkdj)}}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="住院" align="center">
        <el-table-column label="费用" prop="bz" align="center">
          <template slot-scope="scope"><span @click="viewDetail(scope.row,'住院')" style="color:#1B65B9;cursor:pointer;">{{(scope.row.bz*1).toFixed(2)}}</span></template>
        </el-table-column>
        <el-table-column label="占比%" align="center">
          <template slot-scope="scope">
            <span>{{clacPercent(scope.row.bz*1,scope.row.zkdj)}}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="合计" align="center">
        <el-table-column label="费用" align="center">
          <template slot-scope="scope"><span @click="viewDetail(scope.row, '')" style="color:#1B65B9;cursor:pointer;">{{(scope.row.tym*1+scope.row.bz*1).toFixed(2)}}</span></template>
        </el-table-column>
        <el-table-column label="占比%"  align="center">
            <template slot-scope="scope">
              <span>{{clacPercent(scope.row.tym*1+scope.row.bz*1,scope.row.zkdj)}}</span>
            </template>
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getListjg } from '@/api/renwu/renwufour'
export default {
  name:'Wgtable',
  data(){
    return {
      tableData: [],
      concatList:[],
      splitList:{}
    }
  },
  created(){
    this.getList()
  },
  methods:{
    handelCellStyle ({row, column, rowIndex, columnIndex}) {
      if (rowIndex === this.tableData.length - 1 && columnIndex === 0) {
        return {borderRight: 'none', textAlign: 'right', backgroundColor: 'rgb(253, 246, 236)'}
      }
      if (row.xwrd === '小计') {
        return {backgroundColor: 'rgb(254, 240, 240)'}
      }
      if (rowIndex === this.tableData.length - 1) {
        return {backgroundColor: 'rgb(253, 246, 236)'}
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (this.splitList.hasOwnProperty(rowIndex)) {
          return {
            rowspan: this.splitList[rowIndex],
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    viewDetail(row,type){
      this.$emit('view-detail',row,type)
    },
    initList(list){
      const lxObj = {}
      list.forEach(item => {
        const key = item.wglx ? item.wglx : 'lxKey'
        if (lxObj.hasOwnProperty(key)) {
          lxObj[key].push(item)
        } else {
          lxObj[key] = [item]
        }
      })
      // 添加小计
      const xiaoji = {}
      let newList = []
      for (let lxkey in lxObj) {
        const lx = lxObj[lxkey][0].wglx
        const zkdj = lxObj[lxkey][0].zkdj
        xiaoji[lxkey] = {}
        xiaoji[lxkey]['bz'] = lxObj[lxkey].reduce((a, b) => { return a + b.bz * 1 }, 0)
        xiaoji[lxkey]['tym'] = lxObj[lxkey].reduce((a, b) => { return a + b.tym * 1 }, 0)
        lxObj[lxkey].push({wglx: lx, xwrd: '小计', bz: xiaoji[lxkey]['bz'], tym: xiaoji[lxkey]['tym'], zkdj})
        newList = newList.concat(lxObj[lxkey])
      }
      // 添加合计
      let hjbz = 0
      let hjtym = 0
      for (let key in xiaoji) {
        xiaoji[key]['bz'] && (hjbz += xiaoji[key]['bz'] * 1)
        xiaoji[key]['tym'] && (hjtym += xiaoji[key]['tym'] * 1)
      }
      newList.push({wglx: '合计', xwrd: '', bz: hjbz, tym: hjtym, zkdj: hjbz + hjtym})
      return newList
      // const result = []
      // const list = []
      // if(data.length){
      //   const wglx = []
      //   data.forEach((item,i)=>{
      //     wglx.indexOf(item.wglx)<0&&(wglx.push(item.wglx))
      //   })
      //   wglx.forEach((lx,i)=>{
      //     let lxs = data.filter(subitem=>{
      //       return subitem.wglx===lx
      //     })
      //     list.push(lxs)
      //   })
        
      //   list.forEach(item=>{
      //     this.concatList.push(item.length)
      //     let tymSum = 0
      //     let bzmSum = 0
      //     item.forEach(subitem=>{
      //       tymSum += subitem.tym*1
      //       bzmSum += subitem.bz*1
      //       subitem.xiaoji = (subitem.tym*1+subitem.bz*1).toFixed(2)
      //       result.push(subitem)
      //     })
      //     result.push({
      //       xwrd:'小计',
      //       tym:tymSum.toFixed(2),
      //       bz:bzmSum.toFixed(2),
      //       xiaoji:(tymSum+bzmSum).toFixed(2),
      //       zkdj:item[0].zkdj
      //     })
      //   })
      // }
      // console.log(result)
      // return result
    },
    initialWgRow () {
      const firstName = this.tableData.map(item => item.wglx)
      const rowInfo = {}
      firstName.forEach(item => {
        if (!rowInfo.hasOwnProperty(item)) {
          rowInfo[item] = 1
        } else {
          rowInfo[item] += 1
        }
      })

      const rowArr = []
      for (let key in rowInfo) {
        rowArr.push(rowInfo[key])
      }

      let statKey = 0
      const resetRow = {}
      rowArr.forEach(item => {
        resetRow[statKey] = item
        statKey += item
      })
      return resetRow
    },
    /** 查询renwu列表 */
    async getList() {
      const {rwpcid,jgdm} = this.$route.query
      const params = {rwpcid,jgdm}
      this.loading = true
      try {
        let  res = await getListjg(params)
        if(res.code===200){
          // this.tableData = res.rows
          this.tableData = this.initList(res.rows)
          this.splitList = this.initialWgRow()
          // this.initList(res.rows)
        }
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    },
    /**
     * 百分比
     */
    clacPercent(molecular,denominator){
      let percent = null
      if(molecular===undefined||molecular===null||denominator===undefined||denominator===null||denominator*1===0){
        percent = '0.00'
      } else {
        percent = ((molecular/denominator)*100).toFixed(2)
      }
      return percent
    }
  }

}
</script>
<style lang="scss">
.jg-table {
  &::v-deep .el-table__footer-wrapper {
    td:first-child {
      border-right: 0 !important;
      text-align: right !important;
      .cell {
        padding-right: 0 !important;
      }
    }
  }
  &::v-deep .el-table {
    .el-table__cell {
      padding: 6px 0;
    }
  }
}
</style>