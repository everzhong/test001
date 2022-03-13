<template>
  <div id="xwbl" style="width:655px;padding:0;margin-left:32px;margin:auto">
    <h1 style="margin:0 0 12px 0;font-size:18px;font-weight:normal;text-align:center">上海市静安区医疗保障局</h1>
    <p style="font-size:14px;text-align:center;letter-spacing:5px">行政执法文书</p>
    <div style="text-align:right;font-size: 12px;margin-bottom: 10px;margin-right: 10px;margin-top: 10px;">
      第<span style="padding:0 8px"></span>页&nbsp;&nbsp;&nbsp;&nbsp;共<span style="padding:0 8px"></span>页</div>
    <div style="padding:30px 35px;font-size:16px;border:1px solid #303313;letter-spacing:1px">
      <p style="font-weight:600;text-align: center;">询问笔录</p>
      <div style="line-height:36px">调查时间：{{parseTime(pageData.jcstarttime,'{y}年{m}月{d}日{h}时{m}分')}}&nbsp;至&nbsp;{{parseTime(pageData.jcendtime,'{y}年{m}月{d}日{h}时{m}分')}}</div>
      <div style="line-height:36px">调查地点：{{pageData.jcdd}}</div>
      <p style="line-height:36px">被询问人信息：</p>
      <div style="line-height:36px;margin-left:16px;">姓名：{{pageData.xwname}}</div>
      <div style="line-height:36px;margin-left:16px;">性别：{{pageData.sex=='0'?'男':pageData.sex=='1'?'女':'未知'}}</div>
      <div style="line-height:36px;margin-left:16px;">联系地址：{{pageData.lxdz}}</div>
      <div style="line-height:36px;margin-left:16px;">工作单位：{{pageData.dwqc}}</div>
      <div style="line-height:36px;margin-left:16px;">联系电话：{{pageData.tel}}</div>
      <div style="line-height:36px;margin-left:16px;">身份证号：{{pageData.sfz}}</div>
      <div style="line-height:36px;margin-left:16px;">记录人：{{pageData.upman}}</div>
      <br/>
      <p style="text-indent:2em;letter-spacing:2px;margin-top:10px;margin-bottom:40px;text-align:justify;line-height: 28px;">
        告知（宣读）：我们是上海市医疗保障局监督检查所的行政执法人员{{pageData.dcjg?`/${pageData.dcjg}`:''}}，这是我们的执法证件，现在对<span style="display:inline-block;text-indent:0;min-width:80px;border-bottom:1px solid #333;padding:0;margin:0 5px;">{{pageData.z1}}</span>之事进行调查。你享有以下权利：执法人员少于两人或执法证件与身份不符的，有权拒绝调查询问；同时你应承担以下义务：如实提供有关材料、回答询问，不得拒绝、阻挠调查。请你配合我们。
      <br>询问内容：{{pageData.z2}}
      </p>
      <br/>
      <div style="margin-bottom:40px;padding-right:90px;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between;">
        <span>被调查人（签名）：{{pageData.xwname}}</span><span>承办人（签名）：</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name:"XwDoc",
  props:['pageData']
}
</script>