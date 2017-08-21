<template>
  <div class="wrapper">
    <div class="main-container">
      <div class="login-box">
        <form action="" class="lf">
          <p class="form-group">
            <label for="phone">手机号：</label>
            <input type="tel" id="phone"
                   name="phone" v-validate="'required|phone'"
                   v-shaking="submit && errors.has('phone')" v-model="phone">
          </p>
          <p class="form-group">
            <label for="password">密&nbsp;&nbsp;&nbsp;码：</label>
            <input type="password" id="password"
                   name="password" v-validate="'required|alpha_dash|min:6|max:20'"
                   v-shaking="submit && errors.has('password')" v-model="password">
          </p>
          <a class="login-btn" href="javascript:;" @click="valid(errors.all())">登录</a>
        </form>
        <p class="btn-group">
          <router-link :to="{name: 'register'}" class="register">用户注册</router-link>
          <router-link :to="{name: 'forget'}" class="forget">忘记密码</router-link>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
  import { user } from '../lib/services'
  import { SHOW_TOAST, DESTINATION } from '../lib/constant'
  import md5 from 'blueimp-md5'
  export default {
    data () {
      return {
        phone: '',
        password: '',
        submit: false
      }
    },
    computed: {
      destination () {
        return this.$store.state.loading.destination
      }
    },
    methods: {
      valid () {
        let that = this
        that.submit = true
        that.$validator.validateAll()
          .then(function () {
            user.signIn({phone: that.phone, password: md5(that.password)})
              .then(data => {
                if (that.destination && that.destination.name) {
                  that.$router.replace({name: that.destination.name})
                  that.$store.commit(DESTINATION, {})
                } else {
                  that.$router.replace({name: 'home'})
                }
              })
              .catch(err => {
                that.$vux.alert.show({
                  content: err.toString()
                })
              })
            that.submit = false
          })
          .catch(err => {
            console.log(err)
            let errors = that.$validator.getErrors().all()
            that.$store.commit(SHOW_TOAST, errors[0])
            that.submit = false
          })
      }
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
  @import "../styles/_theme";
  .main-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    background: url("../assets/ani/lpics729.jpg") no-repeat;
    background-size:cover;
  }
  .login-box {
    .btn-group {
      width: 100%;
      display: flex;
      justify-content: space-between;
      margin-top: 1rem;
      a {
        display: inline-block;
        color: #ffffff;
        padding:.8rem;
        font-size: 1rem;
      }
    }
  }
</style>
