<template>
  <div>
    <el-table
    :data="tableData"
    :span-method="objectSpanMethod"
    style="margin-top:10px">
    <el-table-column
      align="center"
      prop="date"
      label="参保地"
      >
    </el-table-column>
    <el-table-column label="住院" align="center">
      <el-table-column
        align="center"
        prop="province"
        label="费用（元）"
        >
        <template slot-scope="scope">
          <span @click="viewDetail(scope.row)" style="color:#1B65B9;cursor:pointer;">{{scope.row.province}}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="city"
        label="占比（%）"
        >
      </el-table-column>
    </el-table-column>
    <el-table-column label="合计" align="center">
      <el-table-column
        align="center"
        prop="name"
        label="费用（元）"
        >
        <template slot-scope="scope">
          <span @click="viewDetail(scope.row)" style="color:#1B65B9;cursor:pointer;">{{scope.row.province}}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="namePercent"
        label="占比（%）"
        >
      </el-table-column>
    </el-table-column>
  </el-table>
  </div>
</template>
<script>
export default {
  name:'CbdTable',
  data(){
    return {
      tableData: [{
          date: '门诊',
          name: '122',
          namePercent: '11%',
          jcfx: '规则筛查',
          province: '260',
          city: '20%',
          address: '677',
          zip: '10%'
        }, {
          jcfx: '合计',
          name: '122',
          namePercent: '11%',
          province: '260',
          city: '20%',
          address: '677',
          zip: "10%"
        }]
    }
  },
  // props:['tableData'],
  methods:{
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    viewDetail(row){
      this.$emit('view-detail',row)
    }
  }

}
</script>