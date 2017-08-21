<template>
  <div class="wrapper hide-scroll-bar">
    <div class="main-container">
      <div class="g-1">
        <p>
          <i class="material-icons">
            ic_done
          </i>
          {{os[status]}}
        </p>
        <!--<p>订单已取消</p>-->
      </div>
      <div class="g-2">
        <p>
          <i class="material-icons">location_on</i>
          <span>zhin</span>
          <span>13022163937</span>
        </p>
        <p>
          地址: 上海半山万达广场
        </p>
      </div>
      <div class="g-3">
        <p>JD x Tmall</p>
        <div class="pro-info" v-for="(p, i) in order.products" :key="i" @click="toPro(p.sku)">
          <div class="l">
            <img src="/images/asserts/campari-thumb-15.jpg" alt="">
          </div>
          <div class="r">
            <p>{{p.CNName}}/{{p.ENName}}</p>
            <p>数量: {{p.count}} 净含量: {{p.count}}ml</p>
            <p><i>￥34.00</i><a href="javascript:;" @click.stop="addToCart(p)">加入购物车</a></p>
          </div>
        </div>
      </div>
      <div class="g-4">
        <div class="g">
          <p>订单编号: {{order.orderNumber}}</p>
          <p>下单时间: {{date}}</p>
        </div>
        <div class="g">
          <p>支付方式: 白条支付</p>
        </div>
        <div class="g">
          <p>配送方式: 快递</p>
          <p>配送日期: ....xxxxxx</p>
        </div>
      </div>
      <div class="g-5">
        <div class="g">
          <p>商品金额 <i>{{order.amount | currency('￥',2)}}</i></p>
          <p>+运费 <i>￥0.00</i></p>
        </div>
        <div class="g s">
          <p>实付款: <i>{{order.amount | currency('￥',2)}}</i></p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapState } from 'vuex'
  import { order } from '../../lib/services'
  import { CART_ADD_ITEM_A, SHOW_TOAST, ORDER_STATUS } from '../../lib/constant'
  export default {
    data () {
      return {
        on: this.$route.params['on'],
        order: {},
        os: ORDER_STATUS
      }
    },
    computed: {
      ...mapState({
        user: state => state.user.user
      }),
      date () {
        let _d = new Date(this.order.date)
        return _d.toLocaleString()
      },
      status () {
        return this.order.status
      }
    },
    methods: {
      toPro (sku) {
        this.$router.push({name: 'detail', params: {sku: sku}})
      },
      addToCart (p) {
        let that = this
        this.$store.dispatch(CART_ADD_ITEM_A, {_id: this.user._id, sku: p.sku})
          .then(() => {
            that.$store.commit(SHOW_TOAST, {type: 'success', text: '添加成功', width: null})
          })
          .catch(err => {
            console.log(err)
            that.$store.commit(SHOW_TOAST, {type: 'cancel', text: '出错了，稍后再试吧'})
          })
      },
      __checkOrder () {
        let that = this
        order.checkOrder({str: `-1/${this.on}`, _id: this.user._id})
          .then(res => {
            that.order = res
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    created () {
      this.__checkOrder()
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
  @import "../../styles/theme";
  $border: 1px solid $light-border-color;
  .main-container {
    display: flex;
    width: 100%;
    position: relative;
    flex-direction: column;
    background-color: #fffbfb;
    &>* {
      margin-bottom: .5rem;
      border-top: $border;
      border-bottom: $border;
      background-color: #fff;
    }
  }
  .g-1 {
    p:first-child {
      background-color: #ff7a6e;
      font-size: 1rem;
      padding: 1.2rem .8rem;
      color: #ffffff;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      i {
        width: 24px;
        display: flex;
        justify-content: flex-end;
        margin-right: 1rem;
      }
    }
    p:last-child {
      font-size: .9rem;
      padding: .8rem;
    }
  }
  .g-2 {
    display: flex;
    flex-direction: column;
    padding: .8rem;
    p:first-child {
      display: flex;
      flex-direction: row;
      padding: .3rem 0;
      * {
        margin-right: .5rem;
      }
      span {
        font-size: 1rem;
        margin-left: .3rem;
      }
      i {
        border: none;
        font-size: 1rem;
        color: $price-gray-color;
        margin-right: 0;
        padding: 0;
      }
    }
    p:last-child {
      font-size: .7rem;
      color: $price-gray-color;
      display: flex;
      align-items: center;
      margin-top: .4rem;
      margin-left: 1.3rem;
    }
  }
  .g-3 {
    &>p {
      padding: .8rem;
      font-size: .9rem;
      border-bottom: $border;
    }
    display: flex;
    flex-direction: column;
    .pro-info {
      padding: .8rem;
      overflow: hidden;
    }
    .l {
      width: 20%;
      border: $border;
      float: left;
    }
    .r {
      width: 75%;
      float: right;
      display: inline-block;
      p {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: .8rem;
        padding: .2rem 0;
      }
      p:nth-child(2) {
        font-size: .7rem;
        color: $price-gray-color;
      }
      p:last-child {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      a {
        color: #444;
        font-size: .7rem;
        padding: .3rem .4rem;
        border: $border;
        border-radius: .2rem;
      }
    }
  }
  .g-4, .g-5 {
    border-top: $border;
    div.g {
      padding: .4rem .8rem;
      border-bottom: $border;
      p {
        padding: .4rem 0;
        font-size: .9rem;
        color: #a9a9a9;
      }
      &:last-child {
        border-bottom:none;
      }
    }
  }
  .g-5 p {
    display: flex;
    justify-content: space-between;
  }
  .g-5 .s.g p{
    justify-content: flex-end;
    color: #000;
    i {
      color: $common-red-color;
      margin-left: 1rem;
    }
  }
</style>
