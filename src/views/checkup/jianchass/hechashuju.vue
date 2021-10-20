<template>
  <el-drawer
    title="选择核查数据"
    :visible.sync="show"
    :modal="false"
    direction="btt"
    size="100%"
    @closed="closeDrawer">
    <div style="padding:0 20px;overflow:hidden">
      <el-form inline size="mini" :model="form" class="hc-form">
        <el-form-item label="明细项目编号">
          <el-input v-model="form.mxxmbm"></el-input>
        </el-form-item>
        <el-form-item label="明细项目名称">
          <el-input v-model="form.mxxmmc"></el-input>
        </el-form-item> <el-form-item label="通用名">
          <el-input v-model="form.tym"></el-input>
        </el-form-item> <el-form-item label="明细项目类别">
          <el-select v-model="form.mxxmlb"></el-select>
        </el-form-item> 
        <el-form-item>
          <el-button type="primary">查询</el-button>
          <el-button plain>重置</el-button>
        </el-form-item>
      </el-form>
      <div class="btns">
        <el-button size="mini" type="primary">设为核查数据</el-button>
        <el-button size="mini" type="primary">新增诊疗相关耗材</el-button>
        <el-button size="mini" type="primary">删除诊疗相关耗材</el-button>
      </div>
      <sTable :data="gridData" :header="tableHeader" :fixedNum="1" @selection-change="handleSelectionChange">
        <el-table-column slot="fixed" type="selection" width="55" align="center"/>
      </sTable>
    </div>
    <pagination
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
</el-drawer>
</template>
<script>
export default {
  name:'Hechashuju',
  props:['isShow'],
  data(){
    return {
      show:false,
      gridData:[],
      tableHeader:[{
        label: '明细项目编号',
        prop: 'mxxmbm'
      },{
        label: '明细项目名称',
        prop: 'mxxmmc'
      },{
        label: '通用名',
        prop: 'tym'
      },{
        label: '明细项目单价(元)',
        prop: 'mxxmdj',
        viewFun: (mxxmdj)=>{
          return this.formatMoney(mxxmdj,3)
        }
      },{
        label: '明细项目单位',
        prop: 'mxxmdw',
      },{
        label: '明细项目数量',
        prop: 'mxxmsl'
      },{
        prop: 'mxxmbjsfy',
        label: '明细项目医保结算范围费用(元)',
        fixedWidth:-130,
        viewFun: (mxxmbjsfy)=>{
          return this.formatMoney(mxxmbjsfy,2)
        }  
      },{
        label: '明细项目类别',
        prop: 'mxxmlb'
      },{
        label: '相关诊疗项目',
        prop: 'xgzlxm'
      }],
      total:0,
      queryParams:{
        pageNum:1,
        pageSize:50
      },
      form:{
        mxxmbm:'',
        mxxmmc:'',
        tym:'',
        mxxmlb:''
      }
    }
  },
  created(){
    this.show = this.isShow
  },
  methods:{
    closeDrawer(){
      this.$emit('onClose')
    },
    handleSelectionChange(selection){

    },
    getList(){
      
    }
  }
}
</script>
<style lang="scss" scoped>
.fix-table {
  display: flex;
  flex-direction: column;
  &::v-deep .el-table {
    display: flex;
    flex:1 1 0px;
    flex-direction: column;
  }
}
.el-drawer__wrapper {
  position: absolute;
  &::v-deep .el-drawer__header {
    margin-bottom: 15px;
    padding: 15px;
    border-bottom:1px solid #d8dce5;
  }
}
.hc-form {
  &::v-deep .el-form-item {
    margin-bottom: 5px;
    .el-form-item__label {
      font-size: 12px;
    }
  }
}
.btns {
  margin: 10px 0;
}
</style>