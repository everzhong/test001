<template>
  <div class="list-item">
    <p>{{title}}</p>
    <div class="container" v-if="list.length">
      <div class="item" v-for="(info,idx) in list" :key="idx" @click="downLoad(info.wenjianurl)">
        <span class="wj-icon el-icon-document"></span>
        <p class="wj-name">{{info.wenjian}}</p>
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
  data(){
    return {}
  },
  props:['title','list'],
  methods:{
    downLoad(url){
      window.open(url)
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