<template>
  <div class="app-container" style="padding-top:20px">
    <!-- <div style="position:absolute;right:20px;top:-72px;background-color:#fff">
       <el-button type="primary" icon="el-icon-back" size="mini" @click="lianBack">返回</el-button>
    </div> -->
    <div class="page-back-icon" @click="lianBack">
      <i class="el-icon-arrow-left"></i>
    </div>
    <section>
      <list-item title="证件资料" :list="zjList"></list-item>
      <list-item title="检查笔录列表" :list="jcList" @on-down="downloadFile"></list-item>
      <list-item title="询问笔录列表" :list="xwList" @on-down="downloadFile"></list-item>
    </section>
    <div style="overflow: hidden;height:0">
      <bl-doc :pageData="pageData"/>
      <xw-doc :pageData="pageData"/>
    </div>
  </div>
</template> 

<script>
import { listDcqz } from "@/api/renwu/dcqz"
import ListItem from './listItem.vue'
import BlDoc from '../diaochaqz/blDoc.vue'
import XwDoc from '../diaochaqz/xwDoc.vue'
import html2canvas from 'html2canvas'
import JsPDf from 'jspdf'
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
        pageSize: 50000
      },
      pageData:{}
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
            } else if(type==2 || type==4){
              this.jcList.push(element)
            } else if(type==3 || type==5){
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
    downloadFile(row){
      this.pageData = {...row}
      const {dwqc,type,xwname} = row
      let canvasImg = ''
      let title = ''
      if(type==2||type==4){//检查笔录
        canvasImg = document.getElementById('jcbl')
        title = `${dwqc}-检查笔录.pdf`
      } else { //询问笔录
        canvasImg = document.getElementById('xwbl')
        title = `${xwname}-询问笔录.pdf`
      }
      setTimeout(()=>{
        html2canvas(canvasImg,{
          width:1000,
          allowTaint:true,
          useCORS:true
        }).then(canvas=>{
          console.log(canvas)
          let url = canvas.toDataURL('image/jpeg');
          let contentWidth = canvas.width
          let contentHeight = canvas.height
          let imgWidth = 595.28
          let imgHeight = 595.28/(contentWidth/contentHeight)
          let PDF = new JsPDf('p','px','a4')
          PDF.addImage(url,"JPEG",30,25,imgWidth,imgHeight)
          PDF.save(title)
        },300)
      })
    },
  },
  components:{
    ListItem,
    BlDoc,
    XwDoc
  }
};
</script>
