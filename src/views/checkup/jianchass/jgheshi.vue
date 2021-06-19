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
      <section class="transfer">
        <div class="left-part">
          <transfer-item @select="selectChange($event,'leftState')" :options="leftOptions" :tableData="leftList"></transfer-item>
        </div>
        <div class="btn">
          <el-button @click="moveData('leftState','rightList')" type="primary" class="el-icon-arrow-right" size="mini" :disabled="leftState.length==0"></el-button>
          <el-button @click="moveData('rightState','leftList')" type="primary" class="el-icon-arrow-left" size="mini" :disabled="rightState.length==0"></el-button>
        </div>
        <div class="right-part">
          <transfer-item @select="selectChange($event,'rightState')" :options="rightOptions" :tableData="rightList"></transfer-item>
        </div>
      </section>
      <div style="text-align:right;margin-top:10px"> 
        <el-button type="primary" size="mini">确定核实数据</el-button>
      </div>
    </section>
</template>
<script>
import TransferItem from './transferItem.vue'
export default {
  name:'Jgheshi',
  data(){
    return {
      tabsValue:1,
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
    TransferItem
  },
  props:['options'],
  methods:{
    selectChange(data,type){
      this.$set(this,type,data)
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
        console.log(hasIn,78)
        !(hasIn && hasIn.length) && (newList.push(item))
      })
      this[targetDel] = [...newList]
      // this[from] = []
    }
  }
}
</script>
<style lang="scss" scoped>
.transfer {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  >div {
    box-sizing: border-box;
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
  margin-top:10px;
  .head-close {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #606266;
    line-height: 32px;
    padding-left:15px;
    padding-right:10px;
    border:1px solid #cecece;
    margin-bottom: 10px;
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