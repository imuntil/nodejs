<template>
  <div class="wrapper">
    <div class="main-container">
      <div class="login-box">
        <form action="">
          <p class="form-group">
            <label for="nick">昵&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;称:</label>
            <input type="text" id="nick" name="nick" data-vv-as="昵称"
                   v-validate="'required|min:2|max:20'"
                   v-shaking="submit && errors.has('nick')" v-model="nick">
          </p>
          <p class="form-group">
            <label for="password">密&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;码:</label>
            <input type="password" id="password" data-vv-as="密码"
                   name="password" v-validate="'required|alpha_dash|min:6|max:20'"
                   v-shaking="submit && errors.has('password')" v-model="password">
          </p>
          <p class="form-group">
            <label for="re">再次输入:</label>
            <input type="password"  v-validate="'required|confirmed:password'"
                   v-shaking="submit && errors.has('re')" data-vv-as="重复密码"
                   name="re" id="re" v-model="re">
          </p>
          <a href="javascript:;" class="login-btn" @click="valid()">注册</a>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
  import { user } from '../lib/services'
  import md5 from 'blueimp-md5'
  import { mapState } from 'vuex'
  import { SHOW_TOAST, UPDATE_LOADING_STATUS, USER_DELETE_PHONE_CODE_M } from '../lib/constant'
  export default {
    data () {
      return {
        nick: '',
        password: '',
        re: '',
        submit: false
      }
    },
    computed: {
      ...mapState({
        loginTemData: state => state.user.loginTemData
      })
    },
    methods: {
      valid () {
        let that = this
        that.submit = true
        that.$validator.validateAll()
          .then(function () {
            that.submit = false
            that.$store.commit(UPDATE_LOADING_STATUS, {isLoading: true})
            user.login({
              phone: that.loginTemData.phone,
              password: md5(that.password),
              nick: that.nick
            }).then(data => {
              that.$store.commit(USER_DELETE_PHONE_CODE_M)
              that.$vux.confirm.show({
                title: '注册成功',
                confirmText: `前往-我的`,
                cancelText: '前往购物',
                onCancel () {
                  that.$router.replace({name: 'home'})
                },
                onConfirm () {
                  that.$router.replace({name: 'user'})
                }
              })
            }).catch(err => {
              console.log(err)
              that.$vux.alert.show({
                content: '出错了，请稍后重试'
              })
            }).finally(() => {
              that.$store.commit(UPDATE_LOADING_STATUS, {isLoading: false})
            })
          })
          .catch(() => {
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
    position: relative;
    width: 100%;
    height: 100%;
    background: url("../assets/ani/lpics681.jpg") no-repeat;
    background-size:cover;
  }
</style>
