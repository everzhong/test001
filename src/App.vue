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
  // margin-bottom: 10px;
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
.xwrd-table-row {
  background-color:#FFEBEB !important;
}
.isyd-row {
  color:#f00 !important;
}
.xwrd-table-row-normal {
  background-color:rgb(142,234,170) !important;
}
#app {
  .el-menu {
    .new__title {
      height: 56px;
      line-height: 58px;
      font-size: 14px;
      color: #303133;
      padding: 0 20px;
      list-style: none;
      cursor: pointer;
      position: relative;
      background-color: #001528 !important;
      -webkit-transition: border-color 0.3s, background-color 0.3s, color 0.3s;
      transition: border-color 0.3s, background-color 0.3s, color 0.3s;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      white-space: nowrap;
    }
    .el-submenu.is-opened > .new__title .el-submenu__icon-arrow {
      -webkit-transform: rotateZ(180deg);
      transform: rotateZ(180deg);
    }
  }
}
::v-deep .el-table--medium td {
  padding:5px 0 !important;
}

</style>