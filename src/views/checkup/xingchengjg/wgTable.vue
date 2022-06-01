<template>
  <div class="jg-table" v-loading="loading">
    <el-table
      :span-method="objectSpanMethod"
      :data="rows"
      :cell-style="handelCellStyle"
      style="margin-top: 10px"
    >
      <el-table-column label="适用办法" prop="wglx" align="center" min-width="150px" show-overflow-tooltip></el-table-column>
      <el-table-column label="行为认定" prop="xwrd" align="center" min-width="180px" show-overflow-tooltip> </el-table-column>
      <el-table-column label="门诊" align="center">
        <el-table-column label="费用" prop="tym" align="center">
          <template slot-scope="scope"><span @click="viewDetail(scope.row,{jslb:'0101'})" style="color:#1B65B9;cursor:pointer;">{{(scope.row.tym*1).toFixed(2)}}</span></template>
        </el-table-column>
        <el-table-column label="占比%" align="center">
          <template slot-scope="scope">
            <span>{{clacPercent(scope.row.tym*1,scope.row.zkdj)}}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="住院" align="center">
        <el-table-column label="费用" prop="bz" align="center">
          <template slot-scope="scope"><span @click="viewDetail(scope.row,{jslb:'0102'})" style="color:#1B65B9;cursor:pointer;">{{(scope.row.bz*1).toFixed(2)}}</span></template>
        </el-table-column>
        <el-table-column label="占比%" align="center">
          <template slot-scope="scope">
            <span>{{clacPercent(scope.row.bz*1,scope.row.zkdj)}}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="进销存核查" align="center" v-if="showHc">
        <el-table-column label="费用" prop="bz" align="center">
          <template slot-scope="scope"><span @click="viewDetail(scope.row,{ischeck:1})" style="color:#1B65B9;cursor:pointer;">{{(scope.row.mxsum*1).toFixed(2)}}</span></template>
        </el-table-column>
        <el-table-column label="占比%" align="center">
          <template slot-scope="scope">
            <span>{{clacPercent(scope.row.mxsum*1,scope.row.zkdj*1+scope.row.mxsum*1)}}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="合计" align="center">
        <el-table-column label="费用" align="center">
          <template slot-scope="scope">
            <span @click="viewDetail(scope.row, '')" style="color:#1B65B9;cursor:pointer;">{{(scope.row.tym*1+scope.row.bz*1+scope.row.mxsum*1).toFixed(2)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="占比%"  align="center">
            <template slot-scope="scope">
              <span>{{clacPercent(scope.row.tym*1+scope.row.bz*1+scope.row.mxsum*1,scope.row.zkdj)}}</span>
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
      loading:false,
      rows: [],
      concatList:[],
      splitList:{},
      showHc:false
    }
  },
  created(){
    this.getList()
  },
  methods:{
    handelCellStyle ({row, column, rowIndex, columnIndex}) {
      if (rowIndex === this.rows.length - 1 && columnIndex === 0) {
        return {borderRight: 'none', textAlign: 'right', backgroundColor: 'rgb(253, 246, 236)'}
      }
      if (row.xwrd === '小计') {
        return {backgroundColor: 'rgb(254, 240, 240)'}
      }
      if (rowIndex === this.rows.length - 1) {
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
      let sumMxsum = 0
      list.forEach(item => {
        const key = item.wglx ? item.wglx : 'lxKey'
        sumMxsum += ((item.mxsum===null||item.mxsum===undefined||item.mxsum==='null'||item.mxsum==='undefined')?0:item.mxsum*1)
        if (lxObj.hasOwnProperty(key)) {
          const hasName = lxObj[key].filter(subItem=>{return subItem.xwrd==item.xwrd})
          if(hasName.length){
            const idx = lxObj[key].findIndex(element=> element.xwrd==item.xwrd)
            const temp = {...lxObj[key][idx]}
            lxObj[key][idx]['tym'] = temp.tym*1+item.tym*1
            lxObj[key][idx]['bz'] = temp.bz*1+item.bz*1
            lxObj[key][idx]['mxsum'] = temp.mxsum*1+item.mxsum*1
          } else {
            lxObj[key].push(item)
          }
        } else {
          lxObj[key] = [item]
        }
      })
      this.showHc = sumMxsum>0
      // 添加小计
      const xiaoji = {}
      let newList = []

      for (let lxkey in lxObj) {
        const lx = lxObj[lxkey][0].wglx
        xiaoji[lxkey] = {}
        xiaoji[lxkey]['bz'] = lxObj[lxkey].reduce((a, b) => { return a + b.bz * 1 }, 0)
        xiaoji[lxkey]['tym'] = lxObj[lxkey].reduce((a, b) => { return a + b.tym * 1 }, 0)
        xiaoji[lxkey]['mxsum'] = lxObj[lxkey].reduce((a, b) => { return a + b.mxsum * 1 }, 0)
        let zkdj = xiaoji[lxkey]['bz']+xiaoji[lxkey]['tym'] +xiaoji[lxkey]['mxsum']
        // if(xiaoji[lxkey]['mxsum']){
        //   zkdj = zkdj*1+xiaoji[lxkey]['mxsum']
        // }
        lxObj[lxkey].push({wglx: lx, xwrd: '小计', bz: xiaoji[lxkey]['bz'], tym: xiaoji[lxkey]['tym'], mxsum:xiaoji[lxkey]['mxsum'],zkdj})
        newList = newList.concat(lxObj[lxkey])
      }
      // 添加合计
      let hjbz = 0
      let hjtym = 0
      let mxsum = 0
      for (let key in xiaoji) {
        xiaoji[key]['bz'] && (hjbz += xiaoji[key]['bz'] * 1)
        xiaoji[key]['tym'] && (hjtym += xiaoji[key]['tym'] * 1)
        xiaoji[key]['mxsum'] && (mxsum += xiaoji[key]['mxsum'] * 1)
      }
      newList.push({wglx: '合计', xwrd: '', bz: hjbz, tym: hjtym,mxsum:mxsum, zkdj: hjbz + hjtym+mxsum})
      return newList
    },
    initialWgRow () {
      const firstName = this.rows.map(item => item.wglx)
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
    async getList(query) {
      const {rwpcid,jgdm} = this.$route.query
      const params = {rwpcid,jgdm}
      this.loading = true
      try {
        let  res = await getListjg(query?query:params)
        if(res.code===200){
          this.rows = this.initList(res.rows)
          this.splitList = this.initialWgRow()
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
  },
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
  .el-table {
    .el-table__cell {
      padding: 6px 0;
    }
    th {
      padding: 0 !important;
      height: 33px !important;
    }
    td {
      padding:5px 0 !important;
    }
  }
}
</style>