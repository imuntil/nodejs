<template>
  <div class="wrapper">
    <div class="main-container">
      <div class="hide-scroll-bar">
        <header>
          <a href="javascript:;" class="avatar" @click="cropper">
            <img v-if="user.avatar" :src="user.avatar" alt="">
            <img v-else src="../assets/placeholder.png" alt="">
          </a>
          <a href="javascript:;" class="nick" @click="showModal">{{user.nick}}</a>
          <a href="javascript:;" class="modify-avatar" @click="cropper">编辑头像</a>
        </header>
        <group>
          <cell title="我的订单" :link="{name: 'my-order'}" is-link></cell>
          <cell title="我的收藏" is-link></cell>
          <cell title="账号安全" :link="{name: 'safe'}" is-link></cell>
          <cell title="地址管理" :link="{name: 'address'}" is-link></cell>
        </group>
      </div>
      <Modal
        v-model="modal"
        title="修改昵称"
        :loading="true"
        @on-ok="save">
        <p class="modify-nick">
          <input type="text" v-model="nick" maxlength="15">
        </p>
      </Modal>
      <transition name="fadeInOut" enter-active-class="animated fadeInDown" leave-active-class="animated fadeOutUp">
        <cropper-avatar v-show="cropperShow"
                        :size="400"
                        @base64Data="gotData"
                        @closeCropper="cropperClose"></cropper-avatar>
      </transition>
    </div>
  </div>
</template>
<script>
  import {Group, Cell} from 'vux'
  import { Modal } from 'iview'
  import CropperAvatar from '../components/cropper-avatar.vue'
  import { mapState } from 'vuex'
  import { USER_MODIFY_NICK_A, SHOW_TOAST, TEMP_HIDING, USER_MODIFY_AVATAR_A, UPDATE_LOADING_STATUS } from '../lib/constant'
  import _ from 'lodash'

  export default {
    components: {
      Group,
      Cell,
      Modal,
      CropperAvatar
    },
    data () {
      return {
        modal: false,
        nick: '',
        cropperShow: false,
        base64Data: ''
      }
    },
    computed: {
      ...mapState({
        user: (state) => state.user.user
      })
    },
    methods: {
      showModal () {
        this.modal = true
        this.nick = this.user.nick
      },
      save () {
        let that = this
        if (!that.nick || !_.trim(that.nick)) {
          this.$store.commit(SHOW_TOAST, '请输入昵称')
          this.modal = false
          return
        }
        if (that.nick === that.user.nick) {
          that.modal = false
          return
        }
        that.$store.dispatch(USER_MODIFY_NICK_A, {nick: this.nick})
          .then(success => {
            setTimeout(function () {
              that.modal = false
            }, 300)
          })
          .catch(err => {
            console.log(err)
            that.modal = false
          })
      },
      gotData (data) {
        let that = this
        if (!data) {
          this.cropperShow = false
          return
        }
        this.$store.commit(UPDATE_LOADING_STATUS, {isLoading: true})
        this.$store.dispatch(USER_MODIFY_AVATAR_A, {avatar: data})
          .then(url => {
            console.log(url)
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => {
            that.cropperShow = false
            this.$store.commit(UPDATE_LOADING_STATUS, {isLoading: false})
            this.$store.commit(TEMP_HIDING, false)
          })
      },
      cropper () {
        this.cropperShow = true
        this.$store.commit(TEMP_HIDING, true)
      },
      cropperClose () {
        this.cropperShow = false
        this.$store.commit(TEMP_HIDING, false)
      }
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
  @import "../styles/_theme";
  .main-container {
    //background-color: $backgroud-color;
    position: relative;
    width: 100%;
    height: 100%;
    margin:0;
  }
  .hide-scroll-bar {
    height: calc(100% - 50px);
  }
  header {
    position: relative;
    padding-top: 2rem;
    margin-bottom: -1rem;
  }
  .avatar {
    width: 100px;
    height: 100px;
    margin:0 auto 1rem;
    border-radius: 100%;
    overflow: hidden;
    img {
      width: 100%;
    }
  }
  .nick {
    width: 40%;
    text-align: center;
    font-size:1rem;
    color: #444;
    padding:.4rem .4rem;
    margin:0 auto;
  }
  .modify-avatar {
    position: absolute;
    left: 65%;
    top: 40%;
    padding:.5rem;
    color: #444;
    font-size:.9rem;
    margin-top: 1em;
  }
  .modify-nick {
    input {
      width:70%;
      display: block;
      margin: 0 auto;
      padding:.2rem;
      font-size: 1rem;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      border:1px solid $border-gray-color;
      border-radius: .2rem;
      text-align: center;
    }
  }
  .bottom {
    margin-bottom: 2rem;
  }
</style>
