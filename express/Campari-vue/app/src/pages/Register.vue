<template>
  <div class="wrapper">
    <div class="main-container">
      <div class="login-box">
        <form action="">
          <p class="form-group">
            <label for="phone">手机号：</label>
            <input type="tel" id="phone" data-vv-as="手机号码"
                   name="phone" v-validate="'required|phone'" @blur="verifyPhone(errors.has('phone'))"
                   v-shaking="submit && errors.has('phone')" v-model="phone">
          </p>
          <p class="form-group" id="form-group2">
            <label for="code">验证码：</label>
            <input type="tel" id="code" name="code" data-vv-as="验证码"
                   v-validate="'required|digits:4'"
                   v-model="code" v-shaking="submit && errors.has('code')">
            <v-code @onRun="fetchCode()"
                    @msging="codeHandle"
                    :neet-verify="true"
                    :verified="verified"
                    :can="phone && !errors.has('phone')"></v-code>
          </p>
          <a class="login-btn" href="javascript:;" @click="valid(errors.all())">下一步</a>
        </form>
        <router-link class="to-login" :to="{name: 'login'}">用户登录</router-link>
      </div>
    </div>
  </div>
</template>
<script>
  import VCode from '../components/v-code.vue'
  import { user } from '../lib/services'
  import { USER_SAVE_PHONE_CODE_M, SHOW_TOAST } from '../lib/constant'
  export default {
    components: {
      VCode
    },
    data () {
      return {
        submit: false,
        phone: '',
        code: '',
        verified: 'unknown',    // blur时检查号码是否被注册
        verifiedPhone: '',   // 防止一个号码多次验证（多次blur）
        __code: ''
      }
    },
    methods: {
      valid () {
        let that = this
        that.submit = true
        that.$validator.validateAll()
          .then(function () {
            that.submit = false
            if (+that.code === +that.__code) {
              that.$store.commit(USER_SAVE_PHONE_CODE_M, {phone: that.phone, code: that.code})
              that.$router.push({name: 'register2'})
            } else {
              that.$vux.alert.show({
                content: '验证码有误'
              })
            }
          })
          .catch(() => {
            let errors = that.$validator.getErrors().all()
            this.$store.commit(SHOW_TOAST, errors[0])
            that.submit = false
          })
      },
      fetchCode () {
        let that = this
        user.getCode({phone: this.phone})
          .then(data => {
            console.log(data)
            that.__code = data
            console.log(that.__code)
          })
          .catch(err => {
            that.$store.commit(SHOW_TOAST, err.toString())
          })
      },
      verifyPhone (err) {
        if (err) return null
        let that = this
        that.verified = 'unknown'
        if (!that.phone) return null
        if (that.phone === that.verifiedPhone) return null
        user.validatePhone({phone: that.phone})
          .then(data => {
            if (data.code === 1 && data.result === 'has') {
              that.verifiedPhone = that.phone
              that.$vux.alert.show({
                content: '该手机号已被注册'
              })
              that.verified = 'has'
            } else if (data.code === 1 && data.result === 'no') {
              that.verifiedPhone = that.phone
              that.verified = 'no'
            } else {
              this.$store.commit(SHOW_TOAST, '出错了，请稍后重试')
            }
          })
      },
      codeHandle (msg) {
        if (msg && msg.can === false) {
          this.$vux.alert.show({
            content: '请输入正确的手机号'
          })
        } else if (msg && msg.status === 'unknown') {
          this.$store.commit(SHOW_TOAST, '正在验证手机号码，请稍等....')
        } else if (msg && msg.status === 'has') {
          this.$store.commit(SHOW_TOAST, '该手机号已被注册')
        }
      }
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
  .main-container {
    position: relative;
    height: 100%;
    width: 100%;
    background: url("../assets/ani/lpics757.jpg") no-repeat;
    background-size:cover;
  }
  #form-group2 {
    width:100%;
    display: flex;
    position: relative;
    justify-content:space-between;
    label {
      flex: 0 0 30%;
    }
    input {
      width: 30%;
      padding-left:0;
      text-align: center;
    }
    a {
      display: block;
      padding: .6rem;
      color: #ffffff;
      border:1px solid #ffffff;
      border-radius: .2rem;
      min-width:102px;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      text-align: center;
    }
  }
  .to-login {
    display: block;
    padding: .8rem;
    color: #ffffff;
    margin: .8rem auto 0;
    width: 30%;
    text-align: center;
    font-size: 1rem;
  }
</style>
