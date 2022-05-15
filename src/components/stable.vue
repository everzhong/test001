<template>
  <div class="s-table qztable" :class="{'s-table_moving': dragState.dragging}" style="width:100%;height:100%" >
    <el-table 
      :data="data"
      :cell-class-name="cellClassName"
      :header-cell-class-name="headerCellClassName"
      :row-class-name="tableRowClassName"
      border
      style="width:100%" 
      height="100%"
      @selection-change="handleSelectionChange"
      ref="scTable"
    >
      <slot v-if="tableHeader.length" name="fixed" @contextmenu="mouseRightClick"></slot>
      <el-table-column v-for="(col, index) in tableHeader" :key="index"
        :prop="col.prop"
        :label="col.label"
        :min-width="(col.viewTemp==='input'||col.viewTemp==='selector')?'180':columntWidth(col.prop,col.label,col.fixedWidth)"
        :type="col.type"
        :column-key="index.toString()"
        :render-header="renderHeader"
        :formatter="col.formatter"
        :align="col.align?col.align:'center'"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span v-if="!col.viewTemp">{{col.viewFun?col.viewFun(scope.row[col.prop],scope.row):scope.row[col.prop]}}</span>
          <el-input v-if="col.viewTemp==='input'" v-model="scope.row[col.prop]" size="mini" @blur="ydChange(scope.row)"></el-input>
          <el-select v-if="col.viewTemp==='selector'" v-model="scope.row[col.prop]" size="mini" @change="ydChange(scope.row)">
            <el-option
              v-for="item in col.selectOption"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue">
            </el-option>
          </el-select>
          <div v-if="col.viewTemp==='button' && scope.row[col.prop]">
            <span v-if="col.noClick && col.noClick(scope.row[col.prop])">{{col.viewFun?col.viewFun(scope.row[col.prop],scope.row):scope.row[col.prop]}}</span>
            <span v-else @click="poerateButton(scope.row)" style="color:#1B65B9;cursor:pointer"> {{col.viewFun?col.viewFun(scope.row[col.prop],scope.row):scope.row[col.prop]}} </span>
          </div>
        </template>
      </el-table-column>
      <slot name="operate" @contextmenu="mouseRightClick" v-if="tableHeader.length"></slot>
    </el-table>
    <div v-if="isPop" class="pop" :style="{left:mouse.left+'px',top:mouse.top+'px'}">
      <el-checkbox :indeterminate="isIndeterminate" v-model="isCheckAll" @change="handleCheckAllChange">全选</el-checkbox>
      <el-checkbox-group v-model="checkedList" @change="handleCheckedCitiesChange">
        <el-checkbox v-for="item in checkeOptions" :label="item.prop" :key="item.prop">{{item.label}}</el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>
<script>
export default {
  name: 'sTable',
  props: {
    data: {
      default: function () {
        return []
      },
      type: Array
    },
    header: {
      default: function () {
        return []
      },
      type: Array
    },
    fixedNum: {
      default: function () {
        return 0
      },
      type: Number
    },
    isrowClassName:{
      type:Boolean,
    },
    checkAll:{
      type:Boolean,
      default:function(){
        return true
      }
    }
  },
  data () {
    return {
      tableHeader: [],
      dragState: {
        start: -9, // 起始元素的 index
        end: -9, // 移动鼠标时所覆盖的元素 index
        dragging: false, // 是否正在拖动
        direction: undefined // 拖动方向
      },
      isPop:false,
      mouse:{
        left:0,
        top:10
      },
      checkeOptions:[...this.header],
      isCheckAll:this.checkAll,
      allProps:[],
      checkedList:[],
      isIndeterminate:!this.checkAll
    }
  },
  created(){
    const needShowList = this.header.filter(item=>{
      return item.hide!==true
    })
    this.tableHeader = needShowList
  },
  mounted(){
    this.allProps = this.header.map(item => item.prop)
    this.checkedList = this.tableHeader.map(item => item.prop)
    const tableDom = this.$refs.scTable.$el
    const theader = tableDom.getElementsByClassName('el-table__header-wrapper')[0]
    theader.addEventListener('contextmenu',this.mouseRightClick)
  },
  methods: {
    columntWidth(prop,label){
      const realLabel = label.replace(' ','')
      let len = realLabel.length<5?5:realLabel.length
      let width = len*19
      const maxw = this.flexWidthFun(prop,this.data)
      if(maxw<width){
        return width
      } else {
        return maxw
      }
    },
    flexWidthFun(str,tableData){
      try {
        str = str + ''
        let columnContent = ''
        if (!tableData || !tableData.length || tableData.length === 0 || tableData === undefined) {
            return ""
        }
        if (!str || !str.length || str.length === 0 || str === undefined) {
            return ""
        }
        // 获取该列中最长的数据(内容)
        let index = 0
        let max_temp = ''
        for (let i = 0; i < tableData.length; i++) {
            const now_temp =tableData[i][str] + ''
            max_temp = tableData[index][str] + ''
            if (now_temp.length >= max_temp.length) {
                index = i
            }
        }
        columnContent =tableData[index][str] + ''
            // console.log('该列数据[i]:', columnContent)
            // 以下分配的单位长度可根据实际需求进行调整
        let flexWidth = 80
        for (const char of columnContent) {
            if ((char >= 'A' && char <= 'Z') || (char >= 'a' && char <= 'z')) {
                // 如果是英文字符，为字符分配8个单位宽度
                flexWidth += 11
            } else if (char >= '\u4e00' && char <= '\u9fa5') {
                // 如果是中文字符，为字符分配15个单位宽度
                flexWidth += 13
            } else {
                // 其他种类字符，为字符分配8个单位宽度
                flexWidth += 5
            }
        }
        if (flexWidth < 80) {
            // 设置最小宽度
            flexWidth = 80
        }
        if (flexWidth > 350) {
            // 设置最大宽度
            flexWidth = 350
        }
        return flexWidth
      } catch (e) {}
    },
    // 自定义表头
    renderHeader (createElement, {column}) {
      return createElement(
        'div', {
          'class': ['thead-cell'],
          on: {
            mousedown: ($event) => { this.handleMouseDown($event, column) },
            mousemove: ($event) => { this.handleMouseMove($event, column) },
            // contextmenu: ($event) => {this.mouseRightClick($event)}
          }
        }, [
          // 添加 <a> 用于显示表头 label
          createElement('a', column.label),
          // 添加一个空标签用于显示拖动动画
          createElement('span', {
            'class': ['virtual']
          })
        ])
    },
    // 按下鼠标开始拖动
    handleMouseDown (e, column) {
      this.dragState.dragging = true
      this.dragState.start = parseInt(column.columnKey)
      // 给拖动时的虚拟容器添加宽高
      let table = document.getElementsByClassName('s-table')[0]
      let virtual = document.getElementsByClassName('virtual')
      for (let item of virtual) {
        item.style.height = table.clientHeight - 1 + 'px'
        item.style.width = item.parentElement.parentElement.clientWidth + 'px'
      }
      document.addEventListener('mouseup', this.handleMouseUp)
    },
    // 鼠标放开结束拖动
    handleMouseUp () {
      this.dragColumn(this.dragState)
      // 初始化拖动状态
      this.dragState = {
        start: -9,
        end: -9,
        dragging: false,
        direction: undefined
      }
      document.removeEventListener('mouseup', this.handleMouseUp)
    },
    // 拖动中
    handleMouseMove (e, column) {
      if (this.dragState.dragging) {
        let index = parseInt(column.columnKey) // 记录起始列
        if (index - this.dragState.start !== 0) {
          this.dragState.direction = index - this.dragState.start < 0 ? 'left' : 'right' // 判断拖动方向
          this.dragState.end = parseInt(column.columnKey)
        } else {
          this.dragState.direction = undefined
        }
      } else {
        return false
      }
    },
    // 拖动易位
    dragColumn ({start, end, direction}) {
      let tempData = []
      let left = direction === 'left'
      let min = left ? end : start - 1
      let max = left ? start + 1 : end
      for (let i = 0; i < this.tableHeader.length; i++) {
        if (i === end) {
          tempData.push(this.tableHeader[start])
        } else if (i > min && i < max) {
          tempData.push(this.tableHeader[ left ? i - 1 : i + 1 ])
        } else {
          tempData.push(this.tableHeader[i])
        }
      }
      this.tableHeader = tempData
    },
    headerCellClassName ({columnIndex}) {
      let active = columnIndex - this.fixedNum === this.dragState.end ? `darg_active_${this.dragState.direction}` : ''
      let start = columnIndex - this.fixedNum === this.dragState.start ? `darg_start` : ''
      return `${active} ${start}`
    },
    cellClassName ({columnIndex}) {
      return (columnIndex - this.fixedNum === this.dragState.start ? `darg_start` : '')
    },
    handleSelectionChange(selection){
      this.$emit('selection-change',selection)
    },
    mouseRightClick(e){
      try{
        e.preventDefault()//非IE浏览器
      }catch(error){
        window.event.returnValue = false//IE浏览器
      }
      this.mouse.left = (e.pageX-50-220<10)?10:(e.pageX-50-220)
      this.isPop = true
      this.$refs.scTable.$el.addEventListener('click', ()=>{
        this.isPop = false
      })
    },
    handleCheckAllChange(val){
      this.checkedList = val ? this.allProps : [];
      this.isIndeterminate = false;
      this.tableHeader = val ? [...this.header] : []
    },
    handleCheckedCitiesChange(val){
      let checkedCount = val.length;
      this.isCheckAll = checkedCount === this.allProps.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.allProps.length;
      this.resetOptions([...val])
    },
    resetOptions(list){
      if(list.length){
        const newList = []
        this.header.forEach(item=>{
          if(list.indexOf(item.prop)>-1){
            newList.push(item)
          }
        })
        this.tableHeader = [...newList]
      } else {
        this.tableHeader = []
      }
    },
    ydChange(row){
      this.$emit('yd-change',row)
    },
    poerateButton(row){
      this.$emit('on-click',row)
    },
    tableRowClassName({row}){
      let className = ''
      if(row.xwrd && this.isrowClassName){
        className = row.xwrd.indexOf('未发现违规')>-1?'xwrd-table-row-normal':'xwrd-table-row'
      } else {
        className = ''
      }
      if(row.isyd && row.isyd==1 && this.isrowClassName){
        className+=" isyd-row"
      }
      return  className
    }
  },
  watch: {
    header (val) {
      this.tableHeader = val
    }
  }
}
</script>
<style lang="scss">
.s-table {
  position: relative;
  .pop {
    position: absolute;
    background: #fff;
    min-width: 150px;
    border-radius: 4px;
    border: 1px solid #ebeef5;
    padding: 12px;
    z-index: 2000;
    color: #606266;
    line-height: 1.4;
    text-align: justify;
    font-size: 14px;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    word-break: break-all;
    .el-checkbox {
      display: block;
    }
  }
  .el-table .darg_start {
    background-color: rgba(27,101,185,.15);
  }
  .el-table td {
    padding:0;
    height: 40px;
    line-height: 40px;
    .cell {
      width: 100% !important;
    }
  }
  .el-table th {
    padding:6px 0 1px;
    height: 44px;
    background-color: #f0f2f5;
    .cell {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0 !important;
      // .thead-cell {
      //   width: 100%;
      // }
      // a {
      //   display: inline-block;
      //   overflow: hidden;
      //   white-space: nowrap;
      //   text-overflow: ellipsis;
      // }
    }
    .virtual{
      display: block;
      width: auto !important;
      height: auto !important;
      background: none;
      border: none;
      position: absolute;
      top:0;
      bottom: 0;
      left: 1px;
      right: 1px;
      cursor: move !important;
    }
    &.darg_active_left {
      .virtual {
        border-left: 3px dotted #1B65B9;
        z-index: 99;
      }
    }
    &.darg_active_right {
      .virtual {
        border-right: 3px dotted #1B65B9;
        z-index: 99;
      }
    }
  }
  .el-table th.is-leaf, .el-table td {
    border-bottom:1px solid rgba(206,206,206,.3);
  }
  .thead-cell {
    padding: 0;
    display: inline-flex;
    flex-direction: column;
    align-items: left;
    cursor: pointer;
    overflow: initial;
    &:before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
    }
  }
  &.s-table_moving {
    .el-table th .thead-cell{
      cursor: move !important;
    }
    .el-table__fixed {
      cursor: not-allowed;
    }
  }
}
</style>
