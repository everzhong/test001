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
</style>