<template>
  <div class="root-wrap">
    <router-view :key="Math.random()"></router-view>

  <tabbar v-show="show">
    <tabbar-item :selected="index" :link="{name:'home'}">
      <img src="../assets/nav-1.jpg" alt="" slot="icon">
      <img src="../assets/nav-1-a.jpg" alt="" slot="icon-active">
      <span slot="label">首页精选</span>
    </tabbar-item>
    <tabbar-item :selected="active" :link="{name:'products'}">
      <img src="../assets/nav-2.jpg" alt="" slot="icon">
      <img src="../assets/nav-2-a.jpg" alt="" slot="icon-active">
      <span slot="label">全部商品</span>
    </tabbar-item>
    <tabbar-item>
      <img src="../assets/nav-3.jpg" alt="" slot="icon">
      <img src="../assets/nav-3-a.jpg" alt="" slot="icon-active">
      <span slot="label">经典鸡尾酒</span>
    </tabbar-item>
    <tabbar-item show-dot>
      <img src="../assets/nav-4.jpg" alt="" slot="icon">
      <img src="../assets/nav-4-a.jpg" alt="" slot="icon-active">
      <span slot="label">购&nbsp;物&nbsp;车</span>
    </tabbar-item>
    <tabbar-item>
      <img src="../assets/nav-5.jpg" alt="" slot="icon">
      <img src="../assets/nav-5-a.jpg" alt="" slot="icon-active">
      <span slot="label">我&nbsp;&nbsp;&nbsp;&nbsp;的</span>
    </tabbar-item>
  </tabbar>
  </div>
</template>
<script>
  import {Tabbar, TabbarItem} from 'vux'
  import _ from 'lodash'

  export default {
    components: {
      Tabbar,
      TabbarItem
    },
    computed: {
      active () {
        return this.$route.name === 'products2'
      },
      index () {
        return this.$route.name === 'index'
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
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  @import "../styles/reset.css";
  html, body, #app {
    width:100%;
    height:100%;
    overflow: hidden;
    position: relative;
  }
  .root-wrap {
    width:100%;
    height:100%;
    position: absolute;
    top:0;
    left:0;
    overflow: hidden;
  }
</style>
