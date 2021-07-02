<template>
  <div class="jg-table">
    <el-table
    show-summary
    :summary-method="getSummaries"
    :data="tableData"
    :span-method="objectSpanMethod"
    style="margin-top:10px">
    <el-table-column
      align="center"
      prop="wglx"
      label="类型"
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
    }
  },
  created(){
    this.getList()
  },
  methods:{
    getSummaries(param) {
      const { columns, data } = param
      const total = data[0]?data[0].zkdj:0
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        if (index ===1) {
          sums[index] = '';
          return;
        }
        const values = data.map((item,n) => (n%2===0 && Number(item[column.property])));
        if (!values.every(value => isNaN(value)) && index%2===0) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index]  = sums[index].toFixed(2);
        } else if(index%2===1 && total!==0) {
          sums[index] = (sums[index-1]*100/total).toFixed(2)
        }
      });

      return sums;
    },
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
    viewDetail(row,type){
      this.$emit('view-detail',row,type)
    },
     initList(data){
      const result = []
      const list = []
      if(data.length){
        const wglx = []
        data.forEach(item=>{
          wglx.indexOf(item.wglx)<0&&(wglx.push(item.wglx))
        })
        wglx.forEach((lx,i)=>{
          let lxs = data.filter(subitem=>{
            return subitem.wglx===lx
          })
          list.push(lxs)
        })
        
        list.forEach(item=>{
          this.concatList.push(item.length)
          let tymSum = 0
          let bzmSum = 0
          item.forEach(subitem=>{
            tymSum += subitem.tym*1
            bzmSum += subitem.bz*1
            subitem.xiaoji = (subitem.tym*1+subitem.bz*1).toFixed(2)
            result.push(subitem)
          })
          result.push({
            xwrd:'小计',
            tym:tymSum.toFixed(2),
            bz:bzmSum.toFixed(2),
            xiaoji:(tymSum+bzmSum).toFixed(2),
            zkdj:item[0].zkdj
          })
        })
        // const {zkdj} = data[0]
        // const menzhen = {
        //   label:"门诊",
        //   guize:"规则筛查",
        //   total:zkdj,
        //   xiaoji:0
        // }
        // const menzhenhj = {guize:"小计",total:zkdj,xiaoji:0}
        // const zhuyuan = {
        //   label:"住院",
        //   guize:"规则筛查",
        //   total:zkdj,
        //   xiaoji:0
        // }
        // const zhuyuanhj = {guize:"小计",total:zkdj,xiaoji:0}
        // data.forEach(element => {
        //   const {tym,bz} = element
        //   menzhen.xiaoji += tym*1
        //   zhuyuan.xiaoji += bz*1
        //   menzhenhj.xiaoji += tym*1
        //   zhuyuanhj.xiaoji += bz*1
        //   if(element.ybbf==='职保'){
        //     menzhen.zhibaofy = tym
        //     zhuyuan.zhibaofy = bz
        //     menzhenhj.zhibaofy = tym
        //     zhuyuanhj.zhibaofy = bz
        //   } else {
        //     menzhen.jubaofy = tym
        //     zhuyuan.jubaofy = bz
        //     menzhenhj.jubaofy = tym
        //     zhuyuanhj.jubaofy = bz
        //   }
        // });
        // if(menzhen.zhibaofy*1!==0 || menzhen.jubaofy*1!==0){
        //   list.push(menzhen);
        //   list.push(menzhenhj);
        // }
        // if(zhuyuan.zhibaofy*1!==0 || zhuyuanhj.jubaofy*1!==0) {
        //   list.push(zhuyuan);
        //   list.push(zhuyuanhj);
        // }
      }
      return result
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
<style lang="scss" scoped>
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
}
</style>