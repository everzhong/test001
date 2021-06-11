<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default  {
  name:  'App'
}
</script>
<style lang="scss">
.el-table th {
  display: table-cell !important;
}
.top-search {
  margin-bottom: 10px;
  .el-form-item {
    margin-bottom: 10px;
    margin-right: 20px;
  }
}
.sys-table {
  max-height: 510px;
  overflow: auto;
}
.select-no-drawdown {
  .el-select-dropdown {
    display: none;
  }
}
.msg-dialog {
   .el-dialog {
      .el-dialog__header {
        padding:10px 20px;
        border-bottom:1px solid #ebeef5;
        .el-dialog__title {
          font-size: 16px;
          color: #606266;
        }
      }
      .el-table--medium td {
        padding:5px 0;
      }
      .el-dialog__body {
        padding:15px 20px;
        .el-radio__label {
          display: none;
        }
      }
      .el-dialog__headerbtn {
        top:12px;
        cursor: pointer;
      }
    }
  .msg-footer-inner {
    text-align: right;
    margin-top:5px;
  }
}
</style>