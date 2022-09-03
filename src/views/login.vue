<template>
  <div class="login" style="opacity:0">
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      codeUrl: "",
      loginForm: {
        username: "admin",
        password: "admin123",
        rememberMe: false,
        code: "",
        uuid: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "用户名不能为空" }
        ],
        password: [
          { required: true, trigger: "blur", message: "密码不能为空" }
        ],
        code: [{ required: true, trigger: "change", message: "验证码不能为空" }]
      },
      loading: false,
      redirect: '',
      urlQuery:{}
    };
  },
  created() {
    this.urlQuery = this.$route.query
    this.redirect = this.$route.query.redirect||''
    const { userToken }= this.$route.query
    const self = this
    if(userToken){
      self.handlerLoginapi({uid:'',userToken});
    } else {
      window.onmessage = function(e){
        const UID = e.data['loginToken']
        if(UID){
          self.handlerLoginapi({uid:UID},1);
        } else {
          const queryStr = [];
          for(let key in self.urlQuery) {
            queryStr.push(`${key}=${self.urlQuery[key]}`)
          }
          window.parent.postMessage({
            'loginFailed': {
                'systemName': '第三方监管',
                'redirectUrl': `window.location.origin/#${self.redirect}?${queryStr.join('&')}`
            }
          }, '*');
        }
      }
    }
    
  },
  methods: {
    handlerLoginapi(info,flag){
      this.$store.dispatch('ClearInfo')
      this.$store.dispatch("LoginApi", info).then(() => {
          this.$router.push({ path: this.redirect||"/renwu/renwulist",query:this.urlQuery}).catch(()=>{});
        }).catch(() => {
          if(flag) {
            const redirec = window.location.origin + '/#/login'+(this.redirect?`?redirect=${this.redirect}`:'')
            window.parent.postMessage({
              'loginFailed': {
                  'systemName': '第三方监管',
                  'redirectUrl': redirec
              }
            }, '*');
          }
          this.loading = false;
        });
    },
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../assets/images/login-background.jpg");
  background-size: cover;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 38px;
}
</style>
