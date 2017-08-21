<template>
  <div class="wrapper">
    <div class="main-container">
      <div class="top-box hide-scroll-bar">
        <div class="address-box" @click="toAdr">
          <div class="content">
            <div class="adr-l">
              <p>
                <span class="name">{{chosen.name}}</span>
                <span class="phone">{{chosen.phone}}</span>
                <i v-show="chosen.isDefault">默认</i>
                <em v-show="chosen.label">{{chosen.label}}</em>
              </p>
              <p class="adr-detail"><i class="material-icons">location_on</i>{{chosen.province}}{{chosen.city}}{{chosen.detail}}</p>
            </div>
            <div class="adr-r material-icons">
              keyboard_arrow_right
            </div>
          </div>
          <!--<span class="line"></span>-->
        </div>
        <div class="order-info">
          <order-ing-item v-if="orders.length == 1" @count-change="countChange"
                          :canEdit="!!from" :item="orders[0]"></order-ing-item>
          <div class="pros-list" v-else>
            <div class="hide-scroll-bar-horizontal" @click="toList">
              <ul>
                <li v-for="(order, index) in orders" :key="index">
                  <img src="/images/asserts/campari-thumb-5.jpg" alt="">
                </li>
              </ul>
            </div>
          </div>
          <div class="pay-method">
            <span>支付配送</span>
            <div>
              <i>在线支付</i>
              <i>快递运输</i>
              <p><i class="material-icons">schedule</i>工作日、双休日与节假日均可配送</p>
            </div>
          </div>
          <div class="after-service">
            <div>
              <span>退还无忧</span>
              <div>
                <i>{{insurance | currency('￥',2)}}</i>
                <mt-switch v-model="FI"></mt-switch>
              </div>
            </div>
            <p>7天内退货，15天内换货... <i class="material-icons" @click="dialogOpen = true">help_outline</i></p>
          </div>
        </div>
        <div class="money-detail">
          <p>商品金额 <i>{{proMoney | currency('￥',2)}}</i></p>
          <p>运费 <i>{{express | currency('￥',2)}}</i></p>
        </div>
      </div>
      <div class="adr-tips">
        {{chosen.province}}{{chosen.city}}{{chosen.detail}}
      </div>
      <div class="bottom-bar">
        <span>实付款：{{money | currency('￥',2)}}</span>
        <a href="javascript:;" @click="placeOrder">提交订单</a>
      </div>
      <mu-dialog :open="dialogOpen" title="退还无忧服务说明" dialogClass="fi-dialog">
        <div class="fi-box">
          <div class="hide-scroll-bar">
            <p class="fi-detail">1.自签收后若7天内退货，15天内换货时可享受此服务</p>
            <p class="fi-detail">1.自签收后若7天内退货，15天内换货时可享受此服务</p>
            <p class="fi-detail">1.自签收后若7天内退货，15天内换货时可享受此服务</p>
            <p class="fi-detail">1.自签收后若7天内退货，15天内换货时可享受此服务</p>
            <p class="fi-detail">1.自签收后若7天内退货，15天内换货时可享受此服务</p>
            <p class="fi-detail">1.自签收后若7天内退货，15天内换货时可享受此服务</p>
            <p class="fi-detail">1.自签收后若7天内退货，15天内换货时可享受此服务</p>
            <p class="fi-detail">1.自签收后若7天内退货，15天内换货时可享受此服务</p>
            <p class="fi-detail">1.自签收后若7天内退货，15天内换货时可享受此服务</p>
            <p class="fi-detail">1.自签收后若7天内退货，15天内换货时可享受此服务</p>
            <p class="fi-detail">1.自签收后若7天内退货，15天内换货时可享受此服务</p>
            <p class="fi-detail">1.自签收后若7天内退货，15天内换货时可享受此服务</p>
            <p class="fi-detail">1.自签收后若7天内退货，15天内换货时可享受此服务</p>
            <p class="fi-detail">1.自签收后若7天内退货，15天内换货时可享受此服务</p>
            <p class="fi-detail">1.自签收后若7天内退货，15天内换货时可享受此服务</p>
            <p class="fi-detail">1.自签收后若7天内退货，15天内换货时可享受此服务</p>
            <p class="fi-detail">1.自签收后若7天内退货，15天内换货时可享受此服务</p>
            <p class="fi-detail">1.自签收后若7天内退货，15天内换货时可享受此服务</p>
          </div>
        </div>
        <a class="fi-ok" href="javascript:;" @click="dialogOpen = false">我知道了</a>
      </mu-dialog>
      <popup position="bottom" class="pay-popup" v-model="popup">

      </popup>
    </div>
  </div>
</template>
<script>
  import { Switch, Popup } from 'mint-ui'
  import muDialog from 'muse-components/dialog'
  import OrderIngItem from '../components/order-ing-item.vue'
  import {
    CART_ALL_CHOSEN,
    CART_THE_MONEY,
    ADR_CHOSEN_ADDRESS_G,
    ADR_FETCH_ADDRESSES_A,
    CART_UPDATE_BUY_NOW,
    PLACE_ORDER_A,
    CART_IS_ALL_CHOSEN
  } from '../lib/constant'
  import { mapState } from 'vuex'
  import _ from 'lodash'
  export default {
    components: {
      mtSwitch: Switch,
      muDialog,
      OrderIngItem,
      Popup
    },
    data () {
      return {
        // Freight insurance, 运费险
        FI: false,
        dialogOpen: false,
        express: 6,
        insurance: 0.5,
        from: this.$route.params['from'] || null,
        proMoney: 0,
        popup: false
      }
    },
    computed: {
      ...mapState({
        adrs: state => state.address.ADRS,
        user: state => state.user.user,
        buyNow: state => state.cart.buyNow
      }),
      chosen () {
        return this.$store.getters[ADR_CHOSEN_ADDRESS_G] || {}
      },
      money () {
        return this.proMoney + this.express + (this.FI ? this.insurance : 0)
      },
      orders () {
        return this.from
          ? [this.buyNow]
          : this.$store.getters[CART_ALL_CHOSEN]
      },
      isAllChosen () {
        return this.$store.getters[CART_IS_ALL_CHOSEN]
      }
    },
    methods: {
      toAdr () {
        this.$router.push({name: 'address'})
      },
      toList () {
        this.$router.push({name: 'order-list'})
      },
      countChange (value) {
        if (!this.from) return
        this.$store.commit(CART_UPDATE_BUY_NOW, value)
        this.proMoney = this.buyNow.price * value
      },
      placeOrder () {
        let that = this
        let orders = that.__handleOrder()
        that.$store.dispatch(PLACE_ORDER_A, {
          orders: orders,
          from: that.from,
          isAll: that.isAllChosen,
          _id: that.user._id
        })
      },
      __handleOrder () {
        let that = this
        let sku = []
        let counts = []
        _.forEach(that.orders, item => {
          sku.push(item.sku)
          counts.push(item.count)
        })
        return {_id: that.user._id, sku, counts}
      },
      __computeProMoney () {
        this.proMoney = this.from
          ? this.buyNow.count * this.buyNow.price
          : this.$store.getters[CART_THE_MONEY]
      }
    },
    created () {
      if (!this.adrs || !this.adrs.length) {
        this.$store.dispatch(ADR_FETCH_ADDRESSES_A, {_id: this.user._id})
      }
      console.log(this.buyNow)
      this.__computeProMoney()
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
    background-color: $backgroud-color;
  }
  .top-box {
    flex: auto;
    overflow-y: scroll;
  }
  .address-box {
    display: flex;
    flex-direction: column;
    padding: 1rem 2% .5rem;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    border-bottom-style: solid;
    border-bottom-width: 2px;
    border-image: url(../assets/location-pattern.png) 2 2 2 2 repeat repeat;
    background-color: #ffffff;
    margin-bottom: .5rem;
    .content {
      display: flex;
      flex-direction: row;
      .adr-l {
        flex: 1;
        display: flex;
        flex-direction: column;
        p {
          display: flex;
          flex-direction: row;
          padding: .3rem 0;
          * {
            margin-right: .5rem;
          }
          span {
            font-size: 1rem;
            font-weight: 600;
            margin-left: 5%;
          }
          i {
            color: $common-red-color;
            font-size: .7rem;
            padding: .1rem .3rem;
            border: 1px solid $common-red-color;
            border-radius: .2rem;
          }
          em {
            color: $common-blue-color;
            font-size: .7rem;
            padding: .1rem .3rem;
            border: 1px solid $common-blue-color;
            border-radius: .2rem;
          }
          &.adr-detail {
            font-size: .7rem;
            color: #444;
            display: flex;
            align-items:center;
            i {
              border: none;
              font-size: 1rem;
              color: $common-blue-color;
              margin-right: 0;
              padding: 0;
            }
          }
        }
      }
      .adr-r {
        display: flex;
        flex: 0 0 3%;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        font-size: 2rem;
        color: $price-gray-color;
        justify-content: flex-end;
        align-items: center;
      }
    }
  }
  .order-info {
    padding: 1rem 4%;
    background-color: #fff;
    border-top: 1px solid $light-border-color;
    border-bottom: 1px solid $light-border-color;
    margin-bottom: .5rem;
    .pros-list {
      width: 100%;
      div.hide-scroll-bar-horizontal {
        overflow: hidden;
        height: 80px;
        ul {
          width:100%;
          display: inline;
          white-space: nowrap;
          overflow-x:scroll;
          float:left;
          overflow-y:hidden;
          padding-bottom: 1rem;
        }
        li {
          display:inline-block;
          height: 80px;
          width: auto;
          padding-left:10px;
          img {
            height: 100%;
            width: auto;
          }
        }
      }
    }
    .pay-method {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: .9rem;
      padding: .4rem 0;
      border-bottom: 1px solid $light-border-color;
      div {
        display: flex;
        flex-direction: column;
        font-size: .8rem;
        i {
          padding: .2rem 0;
          text-align: right;
        }
        p {
          display: flex;
          justify-content: flex-end;
          align-items:center;
          font-size: .7rem;
          i {
            font-size: 1rem;
            margin-right: .2rem;
          }
        }
      }
    }
    .after-service {
      padding: .4rem 0 0;
      &>div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: .9rem;
        &>div {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        i {
          color: $common-red-color;
          margin-right: 1rem;
        }
      }
      &>p {
        width: 70%;
        color: $price-gray-color;
        font-size: .8rem;
        margin-top: .5rem;
        display: flex;
        align-items: center;
        i {
          font-size: 1rem;
          margin-left: .5rem;
        }
      }
    }
  }
  .money-detail {
    padding: 1rem 4%;
    background-color: #fff;
    border-top: 1px solid $light-border-color;
    border-bottom: 1px solid $light-border-color;
    p {
      display: flex;
      justify-content: space-between;
      padding: .2rem 0;
      margin-bottom: .7rem;
      font-size: .8rem;
      i {
        color: $common-red-color;
      }
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  .adr-tips {
    flex: 0 0 5%;
    font-size: .8rem;
    padding-left: 4%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border-top: 1px solid #e1ce9f;
    background-color: #fffbea;
    min-height: 28px;
  }
  .bottom-bar {
    flex: 0 0 9%;
    display: flex;
    align-items: stretch;
    background-color: #fff;
    min-height: 50px;
    a {
      background-color: $common-red-color;
      color: #ffffff;
      flex: 0 0 35%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    span {
      color: $common-red-color;
      flex: 0 0 65%;
      padding-right: 5%;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      border-top: 1px solid $border-gray-color;
    }
  }
  .fi-box {
    height: 200px;
    overflow: hidden;
    position: relative;
    .hide-scroll-bar {
      height: 200px;
    }
    .fi-detail {
      font-size: .8rem;
      line-height: 1rem;
    }
  }
  .fi-ok {
    color: $common-red-color;
    padding: .8rem 0 0;
    text-align: center;
    display: block;
    margin-top: .5rem;
  }
</style>
<style>
  .fi-dialog {
    border-radius: 1rem !important;
  }
</style>
