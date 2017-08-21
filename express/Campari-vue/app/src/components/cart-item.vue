<template>
  <div class="shopping-cart">
    <swipeout>
      <swipeout-item v-for="(item, index) in cart" :key="item.sku">
        <div slot="right-menu">
          <swipeout-button @click.native="deleteItem(item, index)" type="warn">删除</swipeout-button>
        </div>
        <div slot="content" class="mart-group">
          <div class="item" >
            <div class="choose">
              <a @click="choose(item, index)" href="javascript:void(0);">
                <img v-show="item.chosen" src="../assets/chosen.png" alt="" width="100%">
                <img v-show="!item.chosen" src="../assets/not-choose.png" alt="" width="100%">
              </a>
            </div>
            <div class="img">
              <img src="/images/asserts/campari-thumb-11.jpg" alt="" width="100%">
            </div>
            <div class="infos">
              <p>{{item.ENName}}</p>
              <p>{{item.CNName}}</p>
              <p class="spe">{{item.content}}ml</p>
              <div class="bottom">
                <p class="price">
                  {{item.discounted * item.count | currency('￥', 0)}}
                </p>
                <div class="group">
                  <a href="javascript:void(0);"
                     :class="{disable:item.count == 1}"
                     class="m"
                     @click="count(-1, item, index)">
                    －
                  </a>
                  <span>{{item.count}}</span>
                  <a @click="count(1, item, index)" class="p" href="javascript:void(0);">
                    ＋
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </swipeout-item>
    </swipeout>
  </div>
</template>
<script>
  import {Swipeout, SwipeoutItem, SwipeoutButton} from 'vux'
  import { CART_CHOOSE_A, CART_EDIT_COUNT_A, CART_DELETE_ITEM_A } from '../lib/constant'
  import { mapState } from 'vuex'
  export default {
    components: {
      Swipeout,
      SwipeoutItem,
      SwipeoutButton
    },
    props: {
      cart: {
        type: Array,
        required: true
      }
    },
    data () {
      return {
        editing: false,
        editIndex: -1
      }
    },
    computed: {
      ...mapState({
        user: state => state.user.user
      })
    },
    methods: {
      count (payload, item, index) {
        if (item.count + payload <= 0) return
        this.$store.dispatch(CART_EDIT_COUNT_A, {
          item: {sku: item.sku, _id: this.user._id, by: payload},
          index: index
        })
      },
      choose (item, index) {
        this.$store.dispatch(CART_CHOOSE_A, {
          item: {sku: item.sku, _id: this.user._id, chosen: +!item.chosen},
          index: index
        })
      },
      deleteItem (item, index) {
        this.$store.dispatch(CART_DELETE_ITEM_A, {
          item: {sku: item.sku, _id: this.user._id},
          index: index
        })
      }
    }
  }
</script>
<style lang="scss" type="text/scss" scoped>
  @import "../styles/_theme";
  .shopping-cart {
    width:100%;
    overflow: hidden;
    display: flex;
    background-color: #f6f6f6;
    flex-direction:column;
    .mart-group {
      position: relative;
      margin-bottom:.6rem;
      background-color: #ffffff;
      width:100%;
      display: flex;
      transform:translateX(0);
      transition: all .3s;
    }
    .cart-enter, .cart-leave-active {
      opacity:0;
      transform: scale(0, 0);
    }
    .cart-leave-active {
      position: absolute;
    }

    .item {
      box-sizing: border-box;
      display: flex;
      padding: .8rem;
      flex-direction:row;
      justify-content:space-between;
      background-color: #ffffff;
      border-bottom:1px solid #dddddd;
      flex:1 1 63%;
    }
    .img {
      display: flex;
      flex: 0 0 25%;
      box-sizing: border-box;
      align-items: center;
      border:1px solid $border-gray-color;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      border-radius: .3rem;
    }
    .infos {
      flex: 0 0 60%;
      display: flex;
      padding: .3rem 0;
      box-sizing: border-box;
      flex-direction: column;
      justify-content: space-between;
      font-size: 0.9rem;
      font:{
        size:.9rem;
      }
      p {
        margin-bottom:.2rem;
      }
      .spe {
        margin-top:.4rem;
        margin-bottom:.3rem;
      }
    }
    .bottom {
      display: flex;
      flex-direction:row;
      justify-content: space-between;
      align-items:flex-end;
      .price {
        display: flex;
        align-items: center;
        color: red;
        font-size: .9rem;
        margin-bottom:0;
      }
      .group {
        display: flex;
        flex-direction:row;
        align-items:center;
        a{
          border:1px solid #dddddd;
          padding:.3rem .35rem;
          color: #000;
          text-align: center;
          &.m {
            border-top-left-radius: .3rem;
            border-bottom-left-radius: .3rem;
          }
          &.p {
            border-top-right-radius: .3rem;
            border-bottom-right-radius: .3rem;
          }
        }
        a.disable {
          color: #b2b2b2;
        }
        span {
          display: flex;
          flex: 0 0 14%;
          justify-content: center;
          padding: .3rem 0.5rem;
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          box-sizing: border-box;
          border-top: 1px solid $border-gray-color;
          border-bottom: 1px solid $border-gray-color;
        }
      }
    }

    .choose {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 8%;
      a {
        width:80%;
        padding:10%;
      }
    }
  }
</style>
