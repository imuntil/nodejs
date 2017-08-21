<template>
  <div class="wrapper hide-scroll-bar">
    <div class="main-container">
      <div class="field-box">
        <text-field label-focus-class="label-color-red" underline-focus-class="color-red"
                    :error-text="error" v-model="phone" error-color="#e41035"
                    type="tel" label="手机号码" full-width label-float/><br/>
        <raised-button label="下一步" @click="next" label-class="label-class"
                       full-width class="raised-button"/>
      </div>
    </div>
    <popup position="bottom" popup-class="step2-popup" full-width :open="step2" @close="close(2)">
      <div class="step2-box">
        <p>验证码已发送到手机{{phone}}</p>
        <div class="step2-group">
          <div class="step2-input">
            <text-field label-focus-class="label-color-red" underline-focus-class="color-red"
                        :error-text="codeErr" v-model="code" error-color="#e41035"
                        type="tel" label="短信验证码" full-width label-float/><br/>
          </div>
          <div class="step2-btn">
            <v-code @onRun="fetchCode" :can="step2" :auto="true"></v-code>
          </div>
        </div>
        <raised-button label="下一步" @click="next2" label-class="label-class"
                       full-width class="raised-button2"/>
      </div>
    </popup>
    <popup position="bottom" popup-class="step2-popup" full-width :open="step3" @close="close(3)">
      <div class="step2-box">
        <text-field label-focus-class="label-color-red" underline-focus-class="color-red"
                    :error-text="e3" v-model="pw" error-color="#e41035"
                    type="password" label="设置密码" full-width label-float/><br/>
        <text-field label-focus-class="label-color-red" underline-focus-class="color-red"
                    :error-text="e4" v-model="rpw" error-color="#e41035"
                    type="password" label="确认密码" full-width label-float/><br/>
        <raised-button label="保存" @click="save" label-class="label-class"
                       full-width class="raised-button2"/>
      </div>
    </popup>
    <mu-dialog :open="!!slotMsg" title="提示">
      {{slotMsg}}
      <a href="javascript:;" @click="slotMsg = ''">确定</a>
    </mu-dialog>
  </div>
</template>
<script>
  import textField from 'muse-components/textField'
  import raisedButton from 'muse-components/raisedButton'
  import popup from 'muse-components/popup'
  import muDialog from 'muse-components/dialog'
  import VCode from '../../components/v-code.vue'
  import { timeout } from '../../lib/common-tools'
  import { user } from '../../lib/services'
  import { SHOW_TOAST } from '../../lib/constant'
  import { md5 } from 'vux'
  const _reg = /^0?(13[0-9]|15[0-9]|17[0-9]|18[0-9]|14[0-9])[0-9]{8}$/
  const _reg2 = /^\d{4}$/
  const _reg3 = /^[A-z0-9_]{6,20}$/

  export default {
    components: {
      textField,
      raisedButton,
      popup,
      VCode,
      muDialog
    },
    data () {
      return {
        error: '',
        phone: null,
        step2: false,
        step3: false,
        code: null,
        codeErr: '',
        __code: null,
        pw: '',
        rpw: '',
        e3: '',
        e4: '',
        slotMsg: ''
      }
    },
    methods: {
      next () {
        if (!_reg.test(this.phone)) {
          this.__showError('请输入正确的手机号码')
          return
        }
        //  查询手机是否注册
        let that = this
        user.validatePhone({phone: this.phone})
          .then(data => {
            if (data.code === 1 && data.result === 'has') {
              //  next step
              that.step2 = true
              that.code = null
            } else if (data.code === 1 && data.result === 'no') {
              //  该手机号码尚未注册
              that.__showError('该手机号码尚未注册')
            } else {
              //  出错
              this.$store.commit(SHOW_TOAST, '出错了，请稍后再试')
            }
          })
          .catch(err => {
            console.log(err)
            this.$store.commit(SHOW_TOAST, '出错了，请稍后再试')
          })
      },
      next2 () {
        if (!_reg2.test(this.code) || +this.code !== +this.__code) {
          this.codeErr = '短信验证码有误'
          this.__hideError('codeErr')
          return false
        }
        this.step2 = false
        let that = this
        setTimeout(function () {
          that.pw = ''
          that.rpw = ''
          that.step3 = true
        }, 300)
      },
      close (pop) {
        this['step' + pop] = false
      },
      save () {
        if (!_reg3.test(this.pw)) {
          this.e3 = '密码应当为6-20为数字、字母'
          this.__hideError('e3')
          return
        }
        if (this.pw !== this.rpw) {
          this.__hideError('e4')
          this.e4 = '两次密码不一致'
          return
        }
        let that = this
        user.forget({
          phone: this.phone,
          _new: md5(this.pw),
          _newRepeat: md5(this.rpw)
        }).then((data) => {
          console.log(data)
          that.$router.go(-1)
        }).catch(err => {
          console.log(err)
          this.slotMsg = '出错了，请稍后再试'
        })
      },
      fetchCode () {
        console.log('fetch')
        let that = this
        user.getCode({phone: this.phone || '13022163937'})
          .then(data => {
            that.__code = data
          })
          .catch(err => {
            console.log(err)
            this.slotMsg = '短信验证码获取失败了/(ㄒoㄒ)/~~'
          })
      },
      __hideError (error) {
        let that = this
        timeout(function () {
          that[error] = ''
        }, 1500)
      },
      __showError (error) {
        let that = this
        that.error = error
        this.$store.commit(SHOW_TOAST, error)
        that.__hideError('error')
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
    margin: 0;
    padding: .1rem;
    .field-box {
      width: 90%;
      margin: 1rem auto;
      display: block;
    }
    .raised-button {
      margin-top: 2rem;
      padding: .2rem;
      height: auto;
    }
  }
</style>
<style type="text/scss" lang="scss">
  @import "../../styles/_theme";
  .color-red {
    background-color: #666 !important;
  }
  .label-color-red {
    color: #666 !important;
  }
  .label-class {
    color: #666 !important;
    font-size: 1rem !important;
  }
  .step2-popup, .step3-popup {
    width: 100%;
    padding-bottom:20%;
    padding-top: 1rem;

    .step2-box {
      width: 90%;
      margin: 0 auto;
      &>p {
        width: 100%;
        color: $common-red-color;
        font-size: 1rem;
        padding: .5rem;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        border-bottom:1px solid $border-gray-color;
      }
    }
    .step2-group {
      display: flex;
      flex-direction:row;
      align-items: center;
      justify-content: space-between;
      .step2-input {
        flex: 0 0 60%;
      }
      .step2-btn {
        flex: 0 0 40%;
        justify-content: flex-end;
        display: flex;
        a {
          /*display: inline-block;*/
          overflow: hidden;
          position: relative;
          border-radius: 2px;
          height: 36px;
          line-height: 36px;
          min-width: 88px;
          text-decoration: none;
          text-transform: uppercase;
          border: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          background-color: #ffffff;
          color: rgba(0, 0, 0, 0.87);
          -webkit-box-flex: 0;
          -webkit-flex-shrink: 0;
          -ms-flex: 0 0 auto;
          -ms-flex-negative: 0;
          flex-shrink: 0;
          margin: 0;
          outline: 0;
          padding: 0;
          cursor: pointer;
          box-shadow: rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px;
          text-align: center;
          width: 80%;
        }
      }
    }
    .raised-button2 {
      margin-top: 2rem;
      padding: .4rem;
      height: auto;
    }
  }
</style>
