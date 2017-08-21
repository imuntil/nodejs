<template>
  <div class="wrapper hide-scroll-bar">
    <div class="main-container">
      <group>
        <cell title="手机号码">
          {{user.phone | phone}}
        </cell>
        <cell title="修改登录密码" :link="{name: 'mp'}" is-link></cell>
      </group>
      <a href="javascript:;" class="logout" @click="logout">退出登录</a>
    </div>
  </div>
</template>
<script>
  import { Group, Cell, Popup } from 'vux'
  import { USER_LOGOUT_A } from '../../lib/constant'
  import { mapState } from 'vuex'
  export default {
    components: {
      Group,
      Cell,
      Popup
    },
    data () {
      return {
        popup: false
      }
    },
    computed: {
      ...mapState({
        user: (state) => state.user.user
      })
    },
    methods: {
      logout () {
        let that = this
        that.$vux.confirm.show({
          title: '确认退出么？',
          content: '退出后将不能使用购物车等功能',
          onConfirm () {
            that.__logout()
          }
        })
      },
      showPopup () {
        alert(111)
      },
      __logout () {
        this.$store.dispatch(USER_LOGOUT_A)
        this.$router.push({name: 'home'})
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
    padding-top: .1rem;
    .logout {
      width: 90%;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      padding:.8rem;
      text-align: center;
      border:1px solid $border-gray-color;
      border-radius: .2rem;
      background-color: rgba(255, 255, 255, .5);
      color: #000000;
      margin:2rem auto;
      font-size:1rem;
    }
  }
</style>
