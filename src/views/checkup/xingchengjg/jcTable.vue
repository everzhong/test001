<template>
  <div class="jc-table">
    <!-- <el-table
      show-summary
      :summary-method="getSummaries"
      :data="tableData"
      :span-method="objectSpanMethod"
      style="margin-top: 10px"
    >
      <el-table-column align="center" prop="label" label="就医类型">
      </el-table-column>
      <el-table-column align="center" prop="guize" label="检查方式" />
      <el-table-column label="职保" align="center">
        <el-table-column align="center" prop="zhibaofy" label="费用（元）">
          <template slot-scope="scope">
            <span
              @click="viewDetail(scope.row, '职保')"
              style="color: #1b65b9; cursor: pointer"
              >{{ scope.row.zhibaofy }}</span
            >
          </template>
        </el-table-column>
        <el-table-column align="center" prop="city" label="占比（%）">
          <template slot-scope="scope">
            <span>{{ clacPercent(scope.row.zhibaofy, scope.row.total) }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="居保" align="center">
        <el-table-column align="center" prop="jubaofy" label="费用（元）">
          <template slot-scope="scope">
            <span
              @click="viewDetail(scope.row, '居保')"
              style="color: #1b65b9; cursor: pointer"
              >{{ scope.row.jubaofy }}</span
            >
          </template>
        </el-table-column>
        <el-table-column align="center" prop="zip" label="占比（%）">
          <template slot-scope="scope">
            <span>{{ clacPercent(scope.row.jubaofy, scope.row.total) }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="合计" align="center">
        <el-table-column align="center" prop="xiaoji" label="费用（元）">
          <template slot-scope="scope">
            <span
              @click="viewDetail(scope.row, '')"
              style="color: #1b65b9; cursor: pointer"
              >{{ (scope.row.xiaoji * 1).toFixed(2) }}</span
            >
          </template>
        </el-table-column>
        <el-table-column align="center" prop="namePercent" label="占比（%）">
          <template slot-scope="scope">
            <span>{{
              clacPercent(
                scope.row.zhibaofy * 1 + scope.row.jubaofy * 1,
                scope.row.total
              )
            }}</span>
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
      <el-table-column label="就医类型" prop="jslb" align="center" min-width="150px" show-overflow-tooltip></el-table-column>
      <el-table-column label="检查方式" prop="jcfs" align="center" min-width="150px" show-overflow-tooltip> </el-table-column>
      <el-table-column label="职保" align="center">
        <el-table-column label="费用" prop="zbfy" align="center">
          <template slot-scope="scope">
            <span
              @click="viewDetail(scope.row, '职保')"
              style="color: #1b65b9; cursor: pointer"
              >{{ (scope.row.zbfy*1).toFixed(2) }}</span
            >
          </template>
        </el-table-column>
        <el-table-column label="占比%" prop="zblv" align="center">
          <template slot-scope="scope">
            <span>{{clacPercent(scope.row.zbfy*1,scope.row.total)}}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="居保" align="center">
        <el-table-column label="费用" prop="jbfy" align="center">
          <template slot-scope="scope">
            <span
              @click="viewDetail(scope.row, '居保')"
              style="color: #1b65b9; cursor: pointer"
              >{{ (scope.row.jbfy*1).toFixed(2) }}</span
            >
          </template>
        </el-table-column>
        <el-table-column label="占比%" prop="jblv" align="center">
          <template slot-scope="scope">
            <span>{{clacPercent(scope.row.jbfy*1,scope.row.total)}}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="合计" align="center">
        <el-table-column label="费用" prop="hj" align="center">
          <template slot-scope="scope"><span @click="viewDetail(scope.row, '')" style="color:#1B65B9;cursor:pointer;">{{(scope.row.zbfy*1+scope.row.jbfy*1).toFixed(2)}}</span></template>
        </el-table-column>
        <el-table-column label="占比%" prop="hjlv" align="center">
            <template slot-scope="scope">
              <span>{{clacPercent((scope.row.zbfy*1+scope.row.jbfy*1),scope.row.total)}}</span>
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
      tableData: [],
      splitList: {}
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handelCellStyle ({row, column, rowIndex, columnIndex}) {
      if (rowIndex === this.tableData.length - 1 && columnIndex === 0) {
        return {borderRight: 'none', textAlign: 'right', backgroundColor: 'rgb(253, 246, 236)'}
      }
      if (row.jcfs === '小计') {
        return {backgroundColor: 'rgb(254, 240, 240)', padding: '7px 0'}
      }
      if (rowIndex === this.tableData.length - 1) {
        return {backgroundColor: 'rgb(253, 246, 236)', padding: '7px 0'}
      }
    },
    initialJcRow () {
      const firstName = this.tableData.map(item => item.jslb)
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
      list.forEach(item => {
        const ybbfType = isNaN(item.ybbf * 1) ? 'zbfy' : 'jbfy'
        const gz = item.jcfs ? item.jcfs : '规则筛查'
        const mzgzIdx = menzhen.findIndex(value => {
          return value.jcfs === gz
        })
        const zygzIdx = zhuyuan.findIndex(value => {
          return value.jcfs === gz
        })
        if (mzgzIdx > -1) {
          menzhen[mzgzIdx][ybbfType] = item.tym// 门诊的职保费用或者居保费用
          menzhen[mzgzIdx]['total'] = item.zkdj// 总数
        } else {
          const obj = {jslb: '门诊', jcfs: gz, zbfy: '0.00', zblv: '0.00', jbfy: '0.00', jblv: '0.00', hj: '0.00', hjlv: '0.00', total: item.zkdj}
          obj[ybbfType] = item.tym
          menzhen.push(obj)
        }
        if (zygzIdx > -1) {
          zhuyuan[zygzIdx][ybbfType] = item.bz// 住院的职保费用或者居保费用
          zhuyuan[zygzIdx]['total'] = item.zkdj// 总数
        } else {
          const obj = {jslb: '住院', jcfs: gz, zbfy: '0.00', zblv: '0.00', jbfy: '0.00', jblv: '0.00', hj: '0.00', hjlv: '0.00', total: item.zkdj}
          obj[ybbfType] = item.bz
          zhuyuan.push(obj)
        }
      })
      // 插入小计
      const mzzbxj = menzhen.reduce((a, b) => { return a + b.zbfy * 1 }, 0)
      const mzjbxj = menzhen.reduce((a, b) => { return a + b.jbfy * 1 }, 0)
      const zyzbxj = zhuyuan.reduce((a, b) => { return a + b.zbfy * 1 }, 0)
      const zyjbxj = zhuyuan.reduce((a, b) => { return a + b.jbfy * 1 }, 0)
      const total = menzhen[0].total || '0.00'
      menzhen.push({jslb: '门诊', jcfs: '小计', zbfy: mzzbxj, zblv: '0.00', jbfy: mzjbxj, jblv: '0.00', hj: '0.00', hjlv: '0.00', total})
      zhuyuan.push({jslb: '住院', jcfs: '小计', zbfy: zyzbxj, zblv: '0.00', jbfy: zyjbxj, jblv: '0.00', hj: '0.00', hjlv: '0.00', total})
      // 合并门诊和住院 & 插入总计
      const newList = menzhen.concat(zhuyuan)
      newList.push({jslb: '合计', jcfs: '', zbfy: mzzbxj + zyzbxj, zblv: '0.00', jbfy: mzjbxj + zyjbxj, jblv: '0.00', hj: '0.00', hjlv: '0.00', total})
      return newList
    },
    /** 查询renwu列表 */
    async getList() {
      const { rwpcid, jgdm } = this.$route.query;
      const params = { rwpcid, jgdm };
      this.loading = true;
      try {
        let res = await getListjc(params);
        if (res.code === 200) {
          // this.tableData = res.rows
          this.tableData = this.initList(res.rows);
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
  },
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
  &::v-deep .el-table {
    .el-table__cell {
      padding: 6px 0;
    }
  }
}
</style>