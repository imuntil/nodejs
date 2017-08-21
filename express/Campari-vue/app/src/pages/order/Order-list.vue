<template>
  <div class="wrapper hide-scroll-bar">
    <div class="main-container">
      <p class="header">
        商品清单
        <i>共{{orders.length}}件商品</i>
      </p>
      <order-ing-item v-for="(item, i) in orders" :item="item" :key="i"></order-ing-item>
    </div>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import OrderIngItem from '../../components/order-ing-item.vue'
  import {
    CART_ALL_CHOSEN
  } from '../../lib/constant'
  export default {
    components: {
      OrderIngItem
    },
    computed: {
      ...mapGetters({
        orders: CART_ALL_CHOSEN
      })
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
  @import "../../styles/theme";
  .main-container {
    display: flex;
    width: 100%;
    position: relative;
    flex-direction: column;
    padding: .5rem;
    &>* {
      margin-bottom: 1rem;
    }
    .header {
      width: 100%;
      display: flex;
      justify-content: space-between;
      font-size: .9rem;
      padding: 1rem;
      border-bottom: 1px solid $light-border-color;
    }
  }
</style>
