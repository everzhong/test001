<template>
  <el-dialog width="780px" class="msg-dialog" title="选择行为认定" :visible.sync="options.show">
    <el-select v-model="typeSelect" style="margin-bottom:5px" clearable @change="filterXwrdList">
      <el-option label="监督管理办法（第31号令）" value="1"></el-option>
      <el-option label="监督管理办法（第60号令）" value="2"></el-option>
    </el-select>
    <el-table size="small" v-loading="loading" :data="filterList" @selection-change="handleSelectionChange" border height="350px">
      <el-table-column width="40px" align="center">
            <template slot-scope="scope">
              <el-radio :label="scope.row.xwbh" v-model="xwChecked"></el-radio>
            </template>
          </el-table-column>
      <el-table-column label="从属哪一号令" align="center" prop="type" :formatter="typeFormat" show-overflow-tooltip/>
      <el-table-column label="行为编号" align="center" prop="xwbh" show-overflow-tooltip/>
      <el-table-column label="违规行为" align="center" prop="wgxw"  show-overflow-tooltip/>
      <el-table-column label="类型" align="center" prop="lx" show-overflow-tooltip/>
    </el-table>
    <div class="msg-footer-inner">
      <el-button size="mini" type="primary" plain @click="options.show=false">返回</el-button>
      <el-button size="mini" type="primary" @click="xwConfirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { listXwrd, getXwrd, delXwrd, addXwrd, updateXwrd, exportXwrd } from "@/api/renwu/xwrd";

export default {
  name: "XwrdDialog",
  components: {
  },
  data() {
    return {
      //选中的项
      xwChecked:'',
      //条令
      typeSelect:'1',
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 总条数
      total: 0,
      // xwrd表格数据
      xwrdList: [],
      filterList:[],
      // 从属哪一号令字典
      typeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        type: null,
        xwbh: null,
        wgxw: null,
        lx: null,
        id: null
      },
    };
  },
  props:['options'],
  created() {
    this.getList();
    this.getDicts("sys_renwu_wgfl").then(response => {
      this.typeOptions = response.data;
    });
  },
  methods: {
    //过滤规则
    filterXwrdList(){
      if(this.typeSelect){
        this.filterList = this.xwrdList.filter(item=>{
          return item.type === this.typeSelect
        })
      } else {
        this.filterList = [...this.xwrdList]
      }

    },
    //选择后确定
    xwConfirm(){
      if(this.xwChecked){
        const select = this.filterList.filter(item=>{
          return item.xwbh === this.xwChecked
        })
        this.$emit('on-checked',select[0])
        this.options.show = false
      } else {
        this.msgError('请选择一项违规行为')
      }

    },
    /** 查询xwrd列表 */
    getList() {
      this.loading = true;
      listXwrd(this.queryParams).then(response => {
        this.xwrdList = response.rows;
        this.filterXwrdList(response.rows);
        this.total = response.total;
        this.loading = false;
      }).catch(e=>{
        this.loading = false
      });
    },
    // 从属哪一号令字典翻译
    typeFormat(row, column) {
      return this.selectDictLabels(this.typeOptions, row.type);
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
    },
  }
};
</script>