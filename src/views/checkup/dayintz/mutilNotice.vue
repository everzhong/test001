<template>
<div class="mutil-outer">
  <el-carousel :autoplay="false" arrow="always" height="1800px">
    <el-carousel-item v-for="(item,i) in noticeList" :key="i">
      <single-notice :pageData="{...zhizuo,...item}"></single-notice>
    </el-carousel-item>
  </el-carousel>
  </div>
</template>
<script>
import SingleNotice from './singleNotice.vue'
export default {
  name:'MutilNotice',
  data(){
    return{
    }
  },
  props: ['zhizuo',"noticeList"],
  components:{
    SingleNotice
  }
}
</script>
<style lang="scss" scoped>
.mutil-outer{
  width: 637px;
  &::v-deep .el-carousel--horizontal {
    padding-top:60px;
    &::before{
      content:'';
      display:block;
      position: absolute;
      width:100%;
      height: 36px;
      top:22px;
      background-color: #f2f2f2;
    }
    .el-carousel__arrow {
      top:-20px;
      border-radius: 0;
      &.el-carousel__arrow--left {
        left:0
      }
      &.el-carousel__arrow--right {
        right:0
      }
    }
  } 
}
</style>