<template>
  <section id="jlNotice">
    <div class="print-area" ref="printJl" style="width:635px;padding:0px;flex-shrink:0">
      <h1 style="font-weight: 600;font-size: 16px;text-align: center;margin-bottom: 15px">上海市医疗保险监督检查所</h1>
      <p style="font-size: 14px;text-align: center;letter-spacing: 5px;margin-bottom: 10px;">行政执法文书</p>
      <section style="padding: 20px 40px;font-size: 14px;border: 1px solid #303313;">
        <div style="font-weight: 600;font-size: 16px;text-align: center;margin-bottom: 30px;">监督检查纪律告知书</div>
        <div style="text-align: left;display:inline-block;border-bottom: 1px solid #330313;margin-bottom: 20px;min-width:150px">{{pageData.jgmc?(pageData.jgmc+'：'):''}}</div>
        <div style="text-indent: 2em;letter-spacing: 2px;margin-top: 10px;margin-bottom: 20px;text-align: justify;">根据《上海市基本医疗保险监督管理办法》（市政府第31号令）的有关规定和工作安排，我所自
          <span style="text-indent: 0;text-align: center;display: inline-block;min-width: 60px;border-bottom: 1px solid #303313;"> {{parseTime(pageData.dayinstarttime,'{y}')}}</span>年
          <span style="text-indent: 0;text-align: center;display: inline-block;min-width: 40px;border-bottom: 1px solid #303313;"> {{parseTime(pageData.dayinstarttime,'{m}')}}</span>月
          <span style="text-indent: 0;text-align: center;display: inline-block;min-width: 40px;border-bottom: 1px solid #303313;"> {{parseTime(pageData.dayinstarttime,'{d}')}}</span>日起，对你单位实施医疗保险监督检查。现将监督检查纪律告知如下：
        </div>
        <div style="padding-left:2em;line-height:30px;margin-bottom:20px">
          一、严禁辱骂、殴打当事人。<br/>
          二、严禁侵占、挪用、损毁当事人的财物。<br/>
          三、严禁隐瞒、包庇、纵容违法行为。<br/>
          四、严禁接受当事人的吃请、送礼。<br/>
          五、严禁在工作期间饮酒。<br/>
          六、严禁由被检查单位和个人报销或补贴住宿、餐饮、交通、通讯、医疗等费用。<br/>
          七、严禁接受被检查单位和个人赠送的礼品礼金，及未经批准通过授课等方式获取报酬。<br/>
          八、严禁接受被检查单位和个人的请托干预监督检查工作。<br/>
          九、严禁向被检查单位推销商品或介绍业务。<br/>
          十、严禁利用监督检查工作知悉的内部信息谋取利益。<br/>
          对于违反上述纪律者，按照相关规定处理。<br/>
          联系电话：{{pageData.dayinphone}}
        </div>
        <div style="text-align:right;margin-bottom:30px">
          <p style="text-align:right;margin-bottom:10px">上海市医疗保险监督检查所</p>
          <p style="text-align:right">
            <span style="margin-right:5px">{{parseTime(pageData.dayinriqi,'{y}')}}</span>年
            <span style="margin:0 5px">{{parseTime(pageData.dayinriqi,'{m}')}}</span>月
            <span style="margin:0 5px">{{parseTime(pageData.dayinriqi,'{d}')}}</span>日
          </p>
        </div>
        <p style="text-indent:2em;font-weight:600;margin-bottom:30px">以上内容检查组已告知我单位，我单位将按要求积极支持检查组执行好各项纪律。</p>
        <div style="text-align:right;margin-bottom:30px">
          <p style="text-align:right;margin-bottom:10px">{{pageData.jgmc}}（盖章）</p>
          <p style="text-align:right">
            <span style="margin-right:5px">{{parseTime(pageData.dayinriqi,'{y}')}}</span>年
            <span style="margin:0 5px">{{parseTime(pageData.dayinriqi,'{m}')}}</span>月
            <span style="margin:0 5px">{{parseTime(pageData.dayinriqi,'{d}')}}</span>日
          </p>
        </div>
      </section>
      <div style="border:1px solid #303313;border-top:none;padding:3px 20px 10px;">备注：本文书一式三份，一份留存执法案卷，一份交被检机构，一份张贴检查室门上。</div>
    </div>
    <!-- <div style="text-align:right;padding-right:19px">
      <el-button size="mini" type="primary" v-print="printJilv">打印</el-button>
      <el-button size="mini" type="primary" @click="printEvent('printJl')">打印</el-button>
    </div> -->
  </section>
</template>
<script>
export default {
  name:'JlNotice',
  data(){
    return {}
  },
  mounted(){
  },
  props:['pageData'],
  methods:{
    printEvent(ref) {
      this.$print(this.$refs[ref])
    }
  },
}
</script>