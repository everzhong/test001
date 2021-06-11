<template>
  <el-dialog :visible.sync="options.show" title="机构核实" class="msg-dialog" width="1300px">
    <el-radio-group v-model="tabsValue" size="small" class="top-right-btn" v-if="tabsValue==='three'">
      <el-radio-button label="选择核实数据" value="1"></el-radio-button>
      <el-radio-button label="查看核实情况" value="2"></el-radio-button>
    </el-radio-group>
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
  </el-dialog>
</template>
<script>
import TransferItem from './transferItem.vue'
export default {
  name:'Jgheshi',
  data(){
    return {
      tabsValue:1,
      leftList:[{jgmc:111,rwpcid:181},{jgmc:11331,rwpcid:171},{jgmc:11551,rwpcid:151},{jgmc:12211,rwpcid:121},{jgmc:44111,rwpcid:11}],
      rightList:[],
      leftOptions:{
        title:'待选列表',
        total:110,
      },
      rightOptions:{
        title:'已选列表',
        total:110,
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
      width: 600px;
    }
    &.right-part {
      width: 600px;
    }
  }
}
</style>