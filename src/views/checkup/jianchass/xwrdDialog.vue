<template>
  <el-dialog width="780px" class="msg-dialog" title="选择行为认定" :visible.sync="options.show">
    <el-select v-model="typeSelect" style="margin-bottom:5px" clearable @change="filterXwrdList">
      <el-option label="都督管理办法（第31号令）" :value="1"></el-option>
      <el-option label="都督管理办法（第60号令）" :value="2"></el-option>
    </el-select>
    <el-table size="small" v-loading="loading" :data="filterList" @selection-change="handleSelectionChange" border>
      <el-table-column width="40px" align="center">
            <template slot-scope="scope">
              <el-radio :label="scope.row.xwbh" v-model="xwChecked"></el-radio>
            </template>
          </el-table-column>
      <!-- <el-table-column label="从属哪一号令" align="center" prop="type" :formatter="typeFormat" /> -->
      <!-- <el-table-column label="行为编号" align="center" prop="xwbh" :formatter="xwbhFormat" />
      <el-table-column label="违规行为" align="center" prop="wgxw" :formatter="wgxwFormat" />
      <el-table-column label="类型" align="center" prop="lx" :formatter="lxFormat" /> -->
      <!-- <el-table-column label="ID" align="center" prop="id" :formatter="idFormat" /> -->
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
      typeSelect:1,
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // xwrd表格数据
      xwrdList: [],
      filterList:[],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 从属哪一号令字典
      typeOptions: [],
      // 行为编号字典
      xwbhOptions: [],
      // 违规行为字典
      wgxwOptions: [],
      // 违规从属行为字典
      lxOptions: [],
      // ID字典
      idOptions: [],
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
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  props:['options'],
  created() {
    // this.getList();
    this.xwrdList =[
      {id:1,type:2,xwbh:'6169d09',wgxw:'费用是点击',lx:"收费"},
      {id:2,type:1,xwbh:'6169069',wgxw:'费用是点击',lx:"收费"},
      {id:3,type:1,xwbh:'t169309',wgxw:'费用是点击',lx:"收费"},
      {id:4,type:2,xwbh:'1t6909',wgxw:'费用是点击',lx:"收费"},
      {id:5,type:1,xwbh:'1rf69049',wgxw:'费用是点击',lx:"收费"},
      {id:6,type:1,xwbh:'16d9d09',wgxw:'费用是点击',lx:"收费"},
      {id:7,type:1,xwbh:'169c309',wgxw:'费用是点击',lx:"收费"},
      {id:8,type:2,xwbh:'12909',wgxw:'费sd点击',lx:"收费"},
      {id:9,type:2,xwbh:'2909',wgxw:'费用是点击',lx:"收费"},
      {id:10,type:2,xwbh:'66909',wgxw:'费用是点击',lx:"收费"}
    ]
    this.filterXwrdList();
    this.loading = false
    this.getDicts("sys_renwu_wgfl").then(response => {
      this.typeOptions = response.data;
    });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.xwbhOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.wgxwOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.lxOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.idOptions = response.data;
    // });
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
          return item.type === this.typeSelect
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
      });
    },
    // 从属哪一号令字典翻译
    typeFormat(row, column) {
      return this.selectDictLabel(this.typeOptions, row.type);
    },
    // 行为编号字典翻译
    xwbhFormat(row, column) {
      return this.selectDictLabel(this.xwbhOptions, row.xwbh);
    },
    // 违规行为字典翻译
    wgxwFormat(row, column) {
      return this.selectDictLabel(this.wgxwOptions, row.wgxw);
    },
    // 违规从属行为字典翻译
    lxFormat(row, column) {
      return this.selectDictLabel(this.lxOptions, row.lx);
    },
    // ID字典翻译
    idFormat(row, column) {
      return this.selectDictLabel(this.idOptions, row.id);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        type: null,
        xwbh: null,
        wgxw: null,
        lx: null,
        id: null
      };
      this.resetForm("form");
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
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加xwrd";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getXwrd(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改xwrd";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateXwrd(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addXwrd(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除xwrd编号为"' + id + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delXwrd(types);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有xwrd数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportXwrd(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        })
    }
  }
};
</script>
<style lang="scss" scoped>

</style>