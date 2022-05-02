<template>
  <div class="jc-table" v-loading="loading">
    <el-table
      :span-method="objectSpanMethod"
      :data="rows"
      :cell-style="handelCellStyle"
      style="margin-top: 10px"
    >
      <el-table-column label="就医类型" prop="jslb" align="center" min-width="150px" show-overflow-tooltip></el-table-column>
      <el-table-column label="检查方式" prop="jcfs" align="center" min-width="150px" show-overflow-tooltip> </el-table-column>
      <el-table-column label="职保" align="center">
        <el-table-column label="费用" prop="zbfy" align="center">
          <template slot-scope="scope">
            <span
              v-if="scope.row.jslb!=='进销存核查'"
              @click="viewDetail(scope.row, {ybbf:'0'})"
              style="color: #1b65b9; cursor: pointer"
              >{{ (scope.row.zbfy*1).toFixed(2) }}</span>
              <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="占比%" prop="zblv" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.jslb!=='进销存核查'">{{clacPercent(scope.row.zbfy*1,scope.row.total)}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="居保" align="center">
        <el-table-column label="费用" prop="jbfy" align="center">
          <template slot-scope="scope">
            <span
              v-if="scope.row.jslb!=='进销存核查'"
              @click="viewDetail(scope.row, {ybbf:'b'})"
              style="color: #1b65b9; cursor: pointer"
              >{{ (scope.row.jbfy*1).toFixed(2) }}</span>
              <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="占比%" prop="jblv" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.jslb!=='进销存核查'">{{clacPercent(scope.row.jbfy*1,scope.row.total)}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="合计" align="center">
        <el-table-column label="费用" prop="hj" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.jslb==='进销存核查'||scope.row.jslb==='合计'"  @click="viewDetail(scope.row, scope.row.jslb==='进销存核查'?{ischeck:1}:'')" style="color:#1B65B9;cursor:pointer;">{{(scope.row.hj*1).toFixed(2)}}</span>
            <span v-else @click="viewDetail(scope.row)" style="color:#1B65B9;cursor:pointer;">{{(scope.row.zbfy*1+scope.row.jbfy*1).toFixed(2)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="占比%" prop="hjlv" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.jslb==='进销存核查'||scope.row.jslb==='合计'" >{{clacPercent(scope.row.hj*1,scope.row.total)}}</span>
              <span v-else>{{clacPercent((scope.row.zbfy*1+scope.row.jbfy*1),scope.row.total)}}</span>
            </template>
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getListjc } from "@/api/renwu/renwufour";

export default {
  name: "JcTable",
  data() {
    return {
      loading:false,
      rows: [],
      splitList: {}
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handelCellStyle ({row, column, rowIndex, columnIndex}) {
      if (rowIndex === this.rows.length - 1 && columnIndex === 0) {
        return {borderRight: 'none', textAlign: 'right', backgroundColor: 'rgb(253, 246, 236)'}
      }
      if (row.jcfs === '小计') {
        return {backgroundColor: 'rgb(254, 240, 240)', padding: '7px 0'}
      }
      if (rowIndex === this.rows.length - 1) {
        return {backgroundColor: 'rgb(253, 246, 236)', padding: '7px 0'}
      }
      if(row.jslb === '进销存核查' && columnIndex === 0){
        return {backgroundColor: '#F5F7FA',borderRight: 'none', textAlign: 'right',}
      }
      if(row.jslb === '进销存核查'){
        return {backgroundColor: '#F5F7FA'}
      }
    },
    initialJcRow () {
      const firstName = this.rows.map(item => item.jslb)
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
    viewDetail(row, ybbf) {
      this.$emit("view-detail", row, ybbf);
    },
    initList(list) {
      const menzhen = [{jslb: '门诊', jcfs: '规则筛查', zbfy: '0.00', zblv: '0.00', jbfy: '0.00', jblv: '0.00', hj: '0.00', hjlv: '0.00', total: '0.00'}]
      const zhuyuan = [{jslb: '住院', jcfs: '规则筛查', zbfy: '0.00', zblv: '0.00', jbfy: '0.00', jblv: '0.00', hj: '0.00', hjlv: '0.00', total: '0.00'}]
      const jxchc = []//进销存核查
      let total = 0
      list.forEach(item=>{
        if(item.type===1){
          total+=(item.bz*1+item.tym*1)
        } else {
          total+=item.mxsum*1
        }
      })
      list.forEach(item => {
        if(item.type==1){//非进销存核查
          const ybbfType = isNaN(item.ybbf * 1) ? 'jbfy' : 'zbfy'
          const gz = item.jcfs ? item.jcfs : '规则筛查'
          const mzgzIdx = menzhen.findIndex(value => {
            return value.jcfs === gz
          })
          const zygzIdx = zhuyuan.findIndex(value => {
            return value.jcfs === gz
          })
          if (mzgzIdx > -1) {
            menzhen[mzgzIdx][ybbfType] = item.tym// 门诊的职保费用或者居保费用
            menzhen[mzgzIdx]['total'] = total// 总数
          } else {
            const obj = {jslb: '门诊', jcfs: gz, zbfy: '0.00', zblv: '0.00', jbfy: '0.00', jblv: '0.00', hj: '0.00', hjlv: '0.00', total}
            obj[ybbfType] = item.tym
            menzhen.push(obj)
          }
          if (zygzIdx > -1) {
            zhuyuan[zygzIdx][ybbfType] = item.bz// 住院的职保费用或者居保费用
            zhuyuan[zygzIdx]['total'] = total// 总数
          } else {
            const obj = {jslb: '住院', jcfs: gz, zbfy: '0.00', zblv: '0.00', jbfy: '0.00', jblv: '0.00', hj: '0.00', hjlv: '0.00', total}
            obj[ybbfType] = item.bz
            zhuyuan.push(obj)
          }
        } else if(item.type==2) {//进销存核查
          jxchc.push({jslb: '进销存核查', jcfs: '', zbfy:'-', zblv: '-', jbfy:'-', jblv: '-', hj: item.mxsum, hjlv: '0.00', total})
        }
      })

      // 插入小计
      const mzzbxj = menzhen.reduce((a, b) => { return a + b.zbfy * 1 }, 0)
      const mzjbxj = menzhen.reduce((a, b) => { return a + b.jbfy * 1 }, 0)
      const zyzbxj = zhuyuan.reduce((a, b) => { return a + b.zbfy * 1 }, 0)
      const zyjbxj = zhuyuan.reduce((a, b) => { return a + b.jbfy * 1 }, 0)
      menzhen.push({jslb: '门诊', jcfs: '小计', zbfy: mzzbxj, zblv: '0.00', jbfy: mzjbxj, jblv: '0.00', hj: '0.00', hjlv: '0.00', total})
      zhuyuan.push({jslb: '住院', jcfs: '小计', zbfy: zyzbxj, zblv: '0.00', jbfy: zyjbxj, jblv: '0.00', hj: '0.00', hjlv: '0.00', total})
      // 合并门诊和住院 & 插入总计
      let newList = menzhen.concat(zhuyuan)
      if(jxchc.length){//存在进销存核查 (type=2)
        newList = newList.concat(jxchc)
      }
      newList.push({jslb: '合计', jcfs: '', zbfy: mzzbxj + zyzbxj, zblv: '0.00', jbfy: mzjbxj + zyjbxj, jblv: '0.00', hj: total, hjlv: '0.00', total})
      return newList
    },
    /** 查询renwu列表 */
    async getList(query) {
      const { rwpcid, jgdm } = this.$route.query;
      const params = { rwpcid, jgdm };
      this.loading = true;
      try {
        let res = await getListjc(query?query:params);
        if (res.code === 200) {
          this.rows = this.initList(res.rows);
          this.splitList = this.initialJcRow()
        }
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
    /**
     * 百分比
     */
    clacPercent(molecular, denominator) {
      let percent = null;
      if (
        molecular === undefined ||
        molecular === null ||
        denominator === undefined ||
        denominator === null ||
        denominator * 1 === 0
      ) {
        percent = "0.00";
      } else {
        percent = ((molecular / denominator) * 100).toFixed(3);
      }
      return percent;
    },
  }
};
</script>
<style lang="scss">
.jc-table {
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