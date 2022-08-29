<template>
  <div class="app-container container_1">
    <div ref="containerTop">
        <div class="container-top" v-show="showShearch">
          <el-form class="top-search1" size="small" label-width="100px" ref="queryForm" :inline="true">
                <el-form-item label="险种" prop="ybbf">
                  <el-input readonly :value="selectDictLabels($store.getters.ybbfDic, queryInfoFrom.ybbf)"></el-input>
                </el-form-item>
                <el-form-item label="就医类型" prop="jslb">
                  <el-input readonly :value="selectDictLabels($store.getters.jslbDic, queryInfoFrom.jslb)"></el-input>
                </el-form-item>
                <el-form-item label="批次号" prop="rwpcid">
                  <el-input readonly v-model="queryInfoFrom.rwpcid"></el-input>
                </el-form-item>
                <el-form-item label="数据开始日期" prop="datastarttime">
                  <el-input readonly v-model="queryInfoFrom.datastarttime"></el-input>
                </el-form-item>
                <el-form-item label="数据结束日期" prop="dataendtime">
                  <el-input readonly v-model="queryInfoFrom.dataendtime"></el-input>
                </el-form-item>
                <el-form-item label="机构名称" prop="jgmc">
                  <el-input readonly v-model="queryInfoFrom.jgmc"></el-input>
                </el-form-item>
                <el-form-item label="承办机构" prop="jcjg">
                  <el-input readonly v-model="queryInfoFrom.jcjg"></el-input>
                </el-form-item>
                <el-form-item label="结算等级" prop="jsdj">
                  <el-select disabled v-model="queryInfoFrom.jsdj" placeholder=""  clearable style="width: 180px">
                  <el-option
                    v-for="dict in jsdjOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  />
                </el-select>
                </el-form-item>
                  <el-form-item label="检查组" prop="jczname">
                  <el-input readonly v-model="queryInfoFrom.jczname"></el-input>
                </el-form-item>
                <!-- <div style="position:absolute;right:20px;top:-72px;background-color:#fff">
                  <el-button type="primary" icon="el-icon-back" size="mini" @click="$router.back(-1)">返回</el-button>
                </div> -->
                <div v-if="!noshowback" class="page-back-icon" @click="$router.back(-1)">
                  <i class="el-icon-arrow-left"></i>
                </div>
          </el-form>
        </div>
        <div class="toggle-search" @click="toggleShearch">
          <i v-if="this.showShearch" class = "el-icon-caret-top"></i>
          <i v-else class = "el-icon-caret-bottom"></i>
        </div>
    </div>
    <el-radio-group v-model="tabsValue" size="small">
      <el-radio-button label="1">证据资料</el-radio-button>
      <el-radio-button label="2">检查笔录</el-radio-button>
      <el-radio-button label="3">询问笔录</el-radio-button>
    </el-radio-group>
    <zhengjuzl v-if="tabsValue==='1'"/>
    <jcbl v-else-if="tabsValue==='2'" />
    <xunwbl v-else/>
  </div>
</template>

<script>
import FileUpload from '@/components/FileUpload';
import Zhengjuzl from './zhengjuzl.vue'
import Jcbl from './jcbl.vue'
import Xunwbl from './xunwbl.vue'
import { pageMixin } from '@/utils/pageMixin.js'

export default {
  name: "Dcqz",
  mixins:[pageMixin],
  components: {
    FileUpload,
    Zhengjuzl,
    Jcbl,
    Xunwbl
  },
  props:['noshowback'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 50,
      },
      tabsValue:'1',
      //上页带过来的参数
      queryInfoFrom:{},
      jsdjOptions:[]
    };
  },
  created() {
    this.getDicts("renwu_ss_jgdj").then(response => {
      this.jsdjOptions = response.data;
    });
    this.queryInfoFrom = this.$route.query
    this.tabsValue = this.$route.query.tabKey || '1'
  },
  mounted(){
    console.log(this.noshowback,1212)
  }
};
</script>
