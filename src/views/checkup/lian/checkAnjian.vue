<template>
  <div class="app-container">
    <div style="position:absolute;right:20px;top:-72px;background-color:#fff">
       <el-button type="primary" icon="el-icon-back" size="mini" @click="lianBack">返回</el-button>
    </div>
    <section>
      <list-item title="证件资料" :list="zjList"></list-item>
      <list-item title="检查笔录列表" :list="jcList"></list-item>
      <list-item title="询问笔录列表" :list="xwList"></list-item>
    </section>
  </div>
</template> 

<script>
import { listDcqz } from "@/api/renwu/dcqz";
import ListItem from './listItem.vue'
export default {
  name: "CheckAnjian",
  data() {
    return {
      loading:false,
      zjList:[],
      jcList:[],
      xwList:[],
      queryParams:{
        pageNum: 1,
        pageSize: 100
      },
    };
  },
  created() {
    this.getAjList()
  },
  methods: {
    async getAjList(){
      this.loading = true
      try {
        const {jgdm,rwpicd} = this.$route.query
        const res = await listDcqz({
          jgdm,
          rwpicd,
          ...this.queryParams
        })
        if(res.code==200 && res.rows.length){
          res.rows.forEach(element => {
            const type = element.type
            const wenjianurl = element.wenjianurl
            if(wenjianurl && type==1){
              this.zjList.push(element)
            } else if(wenjianurl && (type==2 || type==4)){
              this.jcList.push(element)
            } else if(wenjianurl && (type==3 || type==5)){
              this.xwList.push(element)
            }
          });
        }
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    },
    lianBack(){
      this.$router.back(-1)
    },
  },
  components:{
    ListItem
  }
};
</script>
