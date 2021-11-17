<template>
  <iframe v-show="baseUrl" class="sf-iframe" :src="baseUrl"></iframe>
</template>
<script>
export default {
  name:'selfBuiltRules',
  data(){
    return{
      baseUrl:''
    }
  },
  created(){
    const {protocol,hostname} = window.location
    this.baseUrl = `${protocol}//${hostname}:8012/#/selfBuiltRules/leftdis/1/userid/${this.$store.getters.name}`
  }
}
</script>
<style scoped>
.sf-iframe {
  display:block;
  position: absolute;
  top:0;
  bottom:0;
  width: 100%;
  height: 100%;
}
</style>
