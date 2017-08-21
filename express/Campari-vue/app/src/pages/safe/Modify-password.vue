<template>
  <div class="wrapper hide-scroll-bar">
    <div class="main-container">
      <form action="">
        <group>
          <cell title="手机号码">
            <i class="format">{{user.phone | phone}}</i>
          </cell>
          <cell title="登录密码">
            <input v-validate="'required|alpha_dash|min:6|max:20'" data-vv-as="登录密码"
                   v-shaking="submit && errors.has('old')" v-model="old"
                   type="password" name="old" placeholder="填写当前登录密码">
          </cell>
          <cell title="设置新密码">
            <input v-validate="'required|alpha_dash|min:6|max:20'" data-vv-as="新密码"
                   v-shaking="submit && errors.has('old')" v-model="new_"
                   type="password" name="_new" placeholder="6-20位字母、数字组合">
          </cell>
          <cell title="确认新密码">
            <input v-validate="'required|alpha_dash|confirmed:_new'" data-vv-as="确认密码"
                   v-shaking="submit && errors.has('old')" v-model="newRepeat_"
                   type="password" name="_newRepeat" placeholder="再次输入密码">
          </cell>
        </group>
        <a href="javascript:;" class="save" @click="valid">保存</a>
      </form>
    </div>
  </div>
</template>
<script>
  import { Cell, Group, md5 } from 'vux'
  import { mapState } from 'vuex'
  import { SHOW_TOAST } from '../../lib/constant'
  import { user } from '../../lib/services'
  export default {
    components: {
      Cell,
      Group
    },
    data () {
      return {
        old: '',
        new_: '',
        newRepeat_: '',
        submit: false
      }
    },
    computed: {
      ...mapState({
        user: (state) => state.user.user
      })
    },
    methods: {
      valid () {
        let that = this
        that.submit = true
        that.$validator.validateAll()
          .then(function () {
            that.submit = false
            user.modifyPw({
              old: md5(that.old),
              _new: md5(that.new_),
              _newRepeat: md5(that.newRepeat_)
            }).then(data => {
              that.$vux.alert.show({
                content: '密码修改成功',
                onHide () {
                  that.$router.go(-1)
                }
              })
            }).catch(err => {
              console.log(err)
              that.$vux.alert.show({
                content: '修改失败，请稍后再试'
              })
            })
            that.submit = false
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
  @import "../../styles/_theme";
  .main-container {
    position: relative;
    width: 100%;
    height: 100%;
    display: block;
    padding-top: .1rem;
  }
  input {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    border:none;
    background-color: transparent;
    padding: .4rem;
  }
  input::-webkit-input-placeholder {
    font-size: .9rem;
  }
  .format {
    padding: .4rem;
    display: inline-block;
  }
  .save {
    width: 90%;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding:.8rem;
    text-align: center;
    border-radius: .2rem;
    background-color: $common-red-color;
    color: #ffffff;
    margin:2rem auto;
    font-size:1rem;
  }
</style>
<style>
  .vux-label {
    font-size:.9rem !important;
  }
</style>
