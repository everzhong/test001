<template>
  <div id="jcbl" style="width:655px;padding:0;margin-left:32px;margin:auto">
    <h1 style="margin:0 0 12px 0;font-size:18px;font-weight:normal;text-align:center">上海市医疗保障局监督检查所{{pageData.dcjg?`/${pageData.dcjg}`:''}}</h1>
    <p style="font-size:14px;text-align:center;letter-spacing:5px">行政执法文书</p>
    <div style="text-align:right;font-size: 12px;margin-bottom: 10px;margin-right: 10px;margin-top: 10px;">
      第<span style="padding:0 8px"></span>页&nbsp;&nbsp;&nbsp;&nbsp;共<span style="padding:0 8px"></span>页</div>
    <div class="content" style="padding:30px 35px;font-size:16px;border:1px solid #303313;letter-spacing:1px">
      <p style="font-weight:600;text-align: center;">检查笔录</p>
      <div style="line-height:36px">检查地点：{{pageData.jcdd}}</div>
      <div style="line-height:36px">检查时间：{{parseTime(pageData.jcstarttime,'{y}年{m}月{d}日{h}时{i}分')}}&nbsp;至&nbsp;{{parseTime(pageData.jcendtime,'{y}年{m}月{d}日{h}时{i}分')}}</div>
      <p style="line-height:36px">被检查人（被检查单位）信息：</p>
      <div style="line-height:36px;margin-left:16px;">姓名（单位全称）：<span>{{pageData.dwqc}}</span></div>
      <div style="line-height:36px;margin-left:16px;">性别（等级）：<span>{{pageData.jsdj==1?'一级':pageData.jsdj==2?'二级':pageData.jsdj==3?'三级':'--'}}</span></div>
      <div style="line-height:36px;margin-left:16px;">住址（单位地址）：<span>{{pageData.addr}}</span></div>
      <div style="line-height:36px;margin-left:16px;">工作单位（法定代表人）：<span>{{pageData.faren}}</span></div>
      <div style="line-height:36px;margin-left:16px;">执法人员：<span>{{pageData.zfry}}</span></div>
      <div style="line-height:36px;margin-left:16px;">记录人：<span>{{pageData.upman}}</span></div>
      <br/>
      <br/>
      <div style="text-indent:2em;letter-spacing:2px;margin-top:10px;margin-bottom:40px;text-align:justify;line-height: 28px;">
        我们（至少2人）是上海市医疗保障局监督检查所的行政执法人员，负责辖区内的医疗保障行政执法工作，这是我们的执法证件，现对<span style="display:inline-block;text-indent:0;min-width:80px;border-bottom:1px solid #333;padding:0;margin:0 5px;"> {{pageData.z1}} </span>进行检查。
      <br/>检查情况：{{pageData.z2}}</div>
      <br/>
      <div style="margin-bottom:40px;padding-right:90px;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between;"><span>被检查人（被检查单位）（签名）：</span><span>见证人（签名）：</span></div>
      <div style="margin-bottom:40px;padding-right:90px;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between;"><span>执法人员（签名）：{{pageData.zfry}}</span><span>记录人（签名）：{{pageData.upman}}</span></div>
    </div>
  </div>
</template>
<script>
export default {
  name:'BlDoc',
  props:['pageData']
}
</script>