<template>
  <div class="wrapper">
    <div class="main-container">
      <div class="top-box hide-scroll-bar">
        <!--<div class="hide-scroll-bar" v-re-render="'.2rem'">-->
          <!---->
        <!--</div>-->
        <div v-re-render="'.2rem'">
          <div class="cart-box">
            <div class="pro-item">
              <cart-item :cart="cart"></cart-item>
            </div>
          </div>
          <div class="may-like">
            <partical-title>猜你喜欢</partical-title>
            <ul>
              <li-item v-for="item in list" :item="item" :key="Math.random()"></li-item>
            </ul>
          </div>
          <palette-com direction="l" class="bottom"></palette-com>
        </div>
      </div>
      <div class="bottom-box">
        <a @click="chooseAll()" href="javascript:void(0);">
          <img v-show="allChosen" src="../assets/chosen.png" alt="" width="100%">
          <img v-show="!allChosen" src="../assets/not-choose.png" alt="" width="100%">
          &nbsp;&nbsp;
          <span>全选</span>
        </a>
        <span class="money">合计: {{totalMoney | currency('￥', 0)}}</span>
        <a href="javascript:;" @click="placeOrder">去结算</a>
      </div>
    </div>
  </div>
</template>
<script>
  import LiItem from '../components/li-item.vue'
  import CartItem from '../components/cart-item.vue'
  import ParticalTitle from '../components/partical-title.vue'
  import PaletteCom from '../components/palette-com.vue'
  import {
    CART_FETCH_CART_A,
    CART_CHOOSE_ALL_A,
    CART_ALL_CHOSEN,
    SHOW_TOAST,
    CART_THE_MONEY
  } from '../lib/constant'
  import { mapState } from 'vuex'
  import _ from 'lodash'
  export default {
    components: {
      LiItem,
      CartItem,
      ParticalTitle,
      PaletteCom
    },
    data () {
      return {
        list: [{}, {}, {}, {}]
      }
    },
    computed: {
      ...mapState({
        user: (state) => state.user.user,
        cart: (state) => state.cart.cart,
        needUpdate: state => state.cart.needUpdate
      }),
      totalMoney () {
        return this.$store.getters[CART_THE_MONEY]
      },
      allChosen () {
        return _.every(this.cart, item => {
          return item.chosen
        })
      },
      ableOrder () {
        return this.$store.getters[CART_ALL_CHOSEN].length
      }
    },
    methods: {
      chooseAll () {
        this.$store.dispatch(CART_CHOOSE_ALL_A, {payload: !this.allChosen, _id: this.user._id})
      },
      placeOrder () {
        if (!this.ableOrder) {
          this.$store.commit(SHOW_TOAST, '您还没有选择商品哦')
          return
        }
        this.$router.push({name: 'order'})
      }
    },
    created () {
      //  获取购物车
      if (!this.cart.length || this.needUpdate) {
        this.$store.dispatch(CART_FETCH_CART_A, {_id: this.user._id})
      }
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
  @import "../styles/_theme";
  .main-container {
    display: flex;
    height: 100%;
    width: 100%;
    position: relative;
    flex-direction: column;
  }
  .top-box {
    flex:0 0 91%;
    overflow-y: scroll;
  }
  .may-like {
    width:90%;
    margin:0 auto;
    ul {
      width:100%;
      display: flex;
      justify-content:space-between;
      flex-wrap:wrap;
      margin-top: 1rem;
      li {
        width:47%;
        margin-bottom:1rem;
      }
    }
  }
  .bottom {
    top:65% !important;
  }
  .bottom-box {
    flex: 1 1 auto;
    display: flex;
    align-items:center;
    justify-content: space-between;
    border-top: 1px solid $border-gray-color;
    a:first-child {
      width:30%;
      color: #000;
      padding:.5rem 5%;
      display: flex;
      align-items:center;
      img {
        width: 1.4rem;
        height: 1.4rem;
      }
    }
    a:last-child {
      color: #ffffff;
      background-color: $common-red-color;
      padding:.6rem 1.2rem;
      margin-right:1rem;
      border-radius: .3rem;
    }
    .money {
      color: $common-red-color;
      font-size: .9rem;
    }
  }
</style>
