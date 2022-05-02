<template>
  <div class="list-item">
    <p>{{title}}</p>
    <div class="container" v-if="list.length">
      <div class="item" v-for="(info,idx) in list" :key="idx" @click="downLoad(info)">
        <span class="wj-icon el-icon-document"></span>
        <p class="wj-name" v-if="info.wenjian">{{info.wenjian}}</p>
        <p class="wj-name" v-else>{{(info.type==2||info.type==4)?`${info.dwqc}-检查笔录`:(info.type==3||info.type==5)?`${info.xwname}-询问笔录`:''}}</p>
      </div>
    </div>
    <div v-else class="no-data">
      暂无数据
    </div>
  </div>
</template>
<script>

export default {
  name:'ListItem',
  props:['title','list'],
  methods:{
    downLoad(info){
      if(info.wenjianurl){
        window.open(info.wenjianurl)
      } else if(info.type!=1) {
        this.$emit('on-down',{...info,jsdj:info.sex} )//检查笔录时sex代表计算等级
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.list-item {
    padding-left: 35px;
    margin-bottom: 70px;
    >p {
      font-size: 18px;
      font-weight: bold;
      color:#666666;
      margin-bottom: 35px;
    }
    .container {
      display: flex;
    }
    .item {
      cursor: pointer;
      width: 100px;
      text-align: center;
      margin-right: 15px;
      .wj-icon {
        font-size:50px;
        color: #999999;
      }
      .wj-name {
        font-size: 14px;
        margin:5px 0 0;
        color:#666666;
        white-space:nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      &:hover {
        * {
          color: #1B65B9;
        }
      }
    }
    .no-data {
      color: #999999;
    }
    
  }
</style>