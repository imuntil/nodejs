<template>
  <a class="v-code"
     @click="handle"
     :style="style"
     href="javascript: void(0)">
    {{running ? time :  text}}
  </a>
</template>
<script>
  export default {
    props: {
      // 倒计时时间
      limit: {
        type: Number,
        default: 60
      },
      // 可否开始倒计时（通常是当手机号不正确时，不能倒计时）
      can: {
        required: true
      },
      // 验证手机号码是否已被注册, unknown表示未知, has表示已被注册，no表示未被注册
      verified: {
        type: String,
        validator (value) {
          return ['unknown', 'has', 'no'].indexOf(value) > -1
        },
        default: 'no'
      },
      //  是否需要验证
      needVerify: {
        type: Boolean,
        default: false
      },
      text: {
        type: String,
        default: '发送验证码'
      },
      //  自动开始
      auto: {
        type: Boolean,
        default: false
      },
      // 倒计时(不可点击) 时的按钮样式
      disabledStyle: function () {
        return {
          background: 'rgba(0,0,0,0.4)',
          border: '2px solid #666',
          color: '#aaa'
        }
      }
    },
    data () {
      return {
        requesting: false,   // 开始请求接口
        running: false,       // 开始倒计时
        inLimit: 0,
        style: {}
      }
    },
    computed: {
      time () {
        return this.inLimit + 's'
      }
    },
    methods: {
      handle () {
        let self = this
        if (!self.can) {
          self.$emit('msging', {can: false})
          return
        }
        if (this.needVerify) {
          let result = this.__verify()
          if (!result) return
        }
        if (self.running) { return }
        self.running = true

        self.$emit('onRun')
        self.stopWatch()
      },
      stopWatch () {
        let self = this
        self.inLimit = self.limit

        // 按钮不可点击
        self.style = self.disabledStyle

        let interval = setInterval(() => {
          self.inLimit --
          if (self.inLimit === 0) {
            clearInterval(interval)

            self.running = false
            self.style = {}
          }
        }, 1000)
      },
      __verify () {
        let self = this
        if (self.verified === 'unknown') {
          // 正在验证手机号
          self.$emit('msging', {status: 'unknown'})
          return false
        }
        if (self.verified === 'has') {
          // 手机号已注册
          self.$emit('msging', {status: 'has'})
          return false
        }
        return true
      }
    },
    watch: {
      can (val) {
        if (val) {
          console.log('xxx')
          this.handle()
        }
      }
    }
  }
</script>
