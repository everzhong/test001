<template>
    <section class="jgheshi">
      <div class="head-close">
        <span class="title">机构核实</span>
        <span class="el-icon-close" @click="$emit('on-close')"></span>
      </div>
      <el-radio-group v-model="tabsValue" size="small">
        <el-radio-button label="1">选择核实数据</el-radio-button>
        <el-radio-button label="2">查看核实情况</el-radio-button>
      </el-radio-group>
      <br>
      <section class="transfer table-main" v-loading="loading" v-show="tabsValue==='1'">
        <div class="left-part">
          <transfer-item ref="leftList" @select="selectChange($event,'leftState')" :options="leftOptions"></transfer-item>
        </div>
        <div class="btn">
          <el-button @click="moveToRight" type="primary" class="el-icon-arrow-right" size="mini" :disabled="leftState.length==0"></el-button>
          <el-button @click="moveToLeft" type="primary" class="el-icon-arrow-left" size="mini" :disabled="rightState.length==0"></el-button>
        </div>
        <div class="right-part">
          <transfer-item-r ref="rightList" @select="selectChange($event,'rightState')" :options="rightOptions"></transfer-item-r>
          <!-- <transfer-item @select="selectChange($event,'rightState')" :options="rightOptions" :tableData="rightList"></transfer-item> -->
        </div>
      </section>
      <div v-show="tabsValue==='1'" style="text-align:right;margin-top:10px;position:absolute;bottom:20px;right:0"> 
        <el-button type="primary" size="mini" @click="confirmHs">确定核实数据</el-button>
      </div>
      <div class="table-main1" v-if="tabsValue==='2'">
        <check-hssz></check-hssz>
      </div>
    </section>
</template>
<script>
import TransferItem from './transferItem.vue'
import TransferItemR from './transferItemR.vue'
import CheckHssz from './checkHssz.vue'
import { updateRenwuthree } from '@/api/renwu/renwuthree'
export default {
  name:'Jgheshi',
  data(){
    return {
      loading:false,
      tabsValue:'1',
      leftList:[],
      rightList:[],
      leftOptions:{
        title:'待选列表',
        total:0,
      },
      rightOptions:{
        title:'已选列表',
        total:0,
      },
      rightState:[],
      leftState:[]
    }
  },
  components:{
    TransferItem,
    TransferItemR,
    CheckHssz
  },
  props:['options'],
  methods:{
    confirmHs(){
      const allSelect = this.$refs.rightList.getAllSelection()
      if(!allSelect.length){
        this.msgError('请从已选列表选择需要核实的数据')
        return
      }
      // const needHs = allSelect.filter(item=>{
      //   return !(item.hszt && item.hszt*1>=1)
      // })
      if(allSelect && allSelect.length){//遍历核实
        const request = []
        allSelect.forEach(need=>{
          request.push(updateRenwuthree({id:need.id,hs:3}))
        })
        this.loading= true
        Promise.all(request).then(()=>{
          this.msgSuccess('核实完成')
          this.$refs.rightList.getList()
          this.loading= false
        }).catch(e=>{
          this.loading= false
        })
      }
    },
    selectChange(data,type){
      this.$set(this,type,data)
    },
    moveToRight(){
      this.$refs.leftList.filterData(this.leftState,()=>{
        this.$refs.rightList.getList()
        this.leftState = []
      })
      
    },
    moveToLeft(){
      this.$refs.leftList.addData(this.rightState)
      this.$refs.rightList.filterData(this.rightState,()=>{
        this.$refs.leftList.getList()
        this.rightState = []
      })
    },
    moveData(from,to){
      const toList = this[to].concat(this[from])
      this[to] = [...toList]
      // this.removeOrgData(from)
      this[from] = []
      console.log(this[from],this[to],11)
    },
    removeOrgData(from){
      console.log(from)
      const targetDel = from.indexOf('left')?'leftList':'rightList'
      const newList = []
      this[targetDel].forEach(item=>{
        const hasIn = this[from].filter(sub=>{
          return item.rwpicd===sub.rwpicd
        })
        !(hasIn && hasIn.length) && (newList.push(item))
      })
      this[targetDel] = [...newList]
      // this[from] = []
    }
  }
}
</script>
<style lang="scss" scoped>
.table-main,.table-main1 {
  position: absolute;
  left: 20px;
  right: 20px;
}
.table-main1 {
  bottom:20px;
  top:90px;
}
.table-main {
  bottom:70px;
  top:105px;
}
.transfer {
  display: flex;
  justify-content: space-between;
  >div {
    box-sizing: border-box;
    height: 100%;
    &.btn {
      flex-shrink: 0;
      width: 60px;
      text-align: center;
      justify-content: center;
      padding-top:15%;
      &::v-deep .el-button {
        margin:5px 0;
      }
      align-content: center;
    }
    &.left-part {
      width: calc(50% - 30px);
    }
    &.right-part {
      width: calc(50% - 30px);;
    }
  }
}
.jgheshi{
  height: 100%;
  position: relative;
  .head-close {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #606266;
    line-height: 32px;
    padding-left:15px;
    padding-right:10px;
    border:1px solid #cecece;
    margin-bottom: 15px;
    // background-color: #f8f8f9;
    .title {
      font-size: 14px;
      font-weight: 600;
    }
    .el-icon-close {
      cursor: pointer;
    }
  }
}
</style>