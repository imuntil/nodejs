<template>
  <div id="app">
    <transition enterActiveClass="animated fadeInDown"
                leaveActiveClass="animated fadeOutDown"
                mode="out-in" class="container-ani">
      <router-view></router-view>
    </transition>

    <transition enterActiveClass="animated fadeInUp tab-bar-ani"
                leaveActiveClass="animated fadeOutDown tab-bar-ani">
      <tabbar v-show="show && !tempHiding">
        <tabbar-item :selected="active('home')" :link="{name:'home'}">
          <img src="./assets/nav-1.jpg" alt="" slot="icon">
          <img src="./assets/nav-1-a.jpg" alt="" slot="icon-active">
          <span slot="label">首页精选</span>
        </tabbar-item>
        <tabbar-item :selected="active('product')" :link="{name:'products'}">
          <img src="./assets/nav-2.jpg" alt="" slot="icon">
          <img src="./assets/nav-2-a.jpg" alt="" slot="icon-active">
          <span slot="label">全部商品</span>
        </tabbar-item>
        <tabbar-item :selected="active('cocktail')" :link="{name: 'cocktail'}">
          <img src="./assets/nav-3.jpg" alt="" slot="icon">
          <img src="./assets/nav-3-a.jpg" alt="" slot="icon-active">
          <span slot="label">经典鸡尾酒</span>
        </tabbar-item>
        <tabbar-item :link="{name: 'cart'}" show-dot>
          <img src="./assets/nav-4.jpg" alt="" slot="icon">
          <img src="./assets/nav-4-a.jpg" alt="" slot="icon-active">
          <span slot="label">购&nbsp;物&nbsp;车</span>
        </tabbar-item>
        <tabbar-item :selected="active('user')" :link="{name: 'user'}">
          <img src="./assets/nav-5.jpg" alt="" slot="icon">
          <img src="./assets/nav-5-a.jpg" alt="" slot="icon-active">
          <span slot="label">我&nbsp;&nbsp;&nbsp;&nbsp;的</span>
        </tabbar-item>
      </tabbar>
    </transition>

    <loading v-model="isLoading"></loading>
    <toast :value="toast.value" :time="toast.time" :width="toast.width"
           :position="toast.position" :text="toast.text" @on-hide="hideGlobalToast"
           :type="toast.type"></toast>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import {Tabbar, TabbarItem, Loading, Toast} from 'vux'
  import _ from 'lodash'
  import { HIDE_TOAST } from './lib/constant'

  export default {
    name: 'app',
    components: {
      Tabbar,
      TabbarItem,
      Loading,
      Toast
    },
    computed: {
      tempHiding () {
        return this.$store.state.loading.tempHiding
      },
      show () {
        return _.includes([
          'index',
          'home',
          'products',
          'products2',
          'cocktail',
          'user'
        ], this.$route.name)
      },
      ...mapState({
        isLoading: (state) => state.loading.isLoading,
        toast: state => state.loading.toast
      })
    },
    methods: {
      active (name) {
        switch (name) {
          case 'home':
            return this.$route.name === 'index' || this.$route.name === 'home'
          case 'product':
            return this.$route.name === 'products' || this.$route.name === 'products2'
          default:
            return this.$route.name === name
        }
      },
      hideGlobalToast () {
        this.$store.commit(HIDE_TOAST)
      }
    }
  }
</script>
<style type="text/scss" lang="scss">
  @import "./styles/reset.css";
  @import "./styles/base.scss";
  html, body, #app {
    width:100%;
    height:100%;
    overflow: hidden;
    position: relative;
  }
  #app {
    position: absolute;
    top:0;
    left:0;
    .tab-bar-ani {
      animation-duration: .4s;
    }
  }
</style>
