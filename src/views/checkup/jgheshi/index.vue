<template>
<div class="app-container container_1" v-loading="loading">
  <div v-if="pageView!=='main'" style="position:absolute;right:20px;top:-31px;background-color:rgb(255, 255, 255);">
    <el-button type="primary" size="mini" @click="submit">提交</el-button>
    <!-- <i class="el-icon-arrow-left" @click="pageView='main',xgmxOptions.show=false" style="cursor:pointer;margin-left:15px;vertical-align:middle"></i> -->
  </div>
  <jgheshi v-if="pageView==='main'" @on-heshi="handleLink($event,'heshuju')"/>
  <heshishuju v-if="pageView==='heshuju'"  :listConfig="xmInfos" @on-liushui="handleLink($event,'lshhz')" @on-xgmx="handleLink($event,'xgmx')" @on-back="pageView='main'"/>
  <hsshiliushuimx v-if="pageView==='lshhz'" :listConfig="xmInfos" @on-back="pageView='heshuju'"/>
  <div v-if="pageView==='xgmx'" style="height:calc(100% - 45px);padding-top:20px">
    <checkmx :options="xgmxOptions" :showBack="true"  @on-back="pageView='heshuju'"/>
  </div>
</div>
</template>
<script>
import Jgheshi from './mainPage.vue'
import Hsshiliushuimx from './hsshiliushuimx.vue'
import {updateRenwutwo} from '@/api/renwu/renwutwo'
// import {listRenwufourHs} from '@/api/renwu/renwufour'
import Checkmx from '../../common/xgmingxi.vue'

import Heshishuju from './heshishuju.vue'
export default {
  name:'Listjg',
  components:{
    Jgheshi,
    Heshishuju,
    Hsshiliushuimx,
    Checkmx
  },
  data(){
    return {
      loading:false,
      xmInfos:{
        id:'',
        rwpcid:'',
        jgdm:''
      },
       xgmxOptions:{
        show:false,
        query:{}
      },
      pageView:'main',//'main' ,'heshuju','lshhz','xgmx','ckxq',
      updateTwoId:''
    }
  },
  created(){
    // this.ybbfOptions = this.$store.getters.ybbfDic
    // this.jslbOptions = this.$store.getters.jslbDic
  },
  methods:{
    async submit(){
      this.loading = true
      try {
        const res = await updateRenwutwo({
          jghs:1,
          id:this.updateTwoId,
          jgdm:this.xmInfos.jgdm,
          rwpcid:this.xmInfos.rwpcid
        })
        if(res.code==200) {
          this.msgSuccess('操作成功！')
        }
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    },
    handleLink(row,type){
      this.xmInfos.rwpcid = row?.rwpcid
      this.xmInfos.jgdm = row?.jgdm
      this.pageView = type
      this.xgmxOptions.query = {
        pch:row.rwpcid,
        jgdm:row.jgdm,
        jgmc:row.jgmc
      }
      if(type==='heshuju'){
        this.updateTwoId = row?.id
      }
      if(type==='lshhz'){
        delete this.xmInfos.id
        this.xmInfos['gzmc'] = row.gzmc
      } else {
        this.xmInfos.id = row?.id
        delete this.xmInfos.gzmc
      }
      this.xgmxOptions.show = true
    },
  }
}
</script>
<style lang="scss" scoped>
.table-main {
  position: absolute;
  top:150px;
  bottom:70px;
  left: 20px;
  right: 20px;
}
.fixed-bottom {
  position: absolute;
  bottom:30px;
  right: 0px;
}
</style>