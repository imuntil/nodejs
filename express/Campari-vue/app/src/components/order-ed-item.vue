<template>
  <div class="order-ed-item">
    <p class="g-1">
      {{os[order.status]}}
      <a href="javascript:;">
        <i class="material-icons">
          ic_delete
        </i>
      </a>
    </p>
    <div class="g-2" v-if="order.products.length === 1" @click="toDetail">
      <div class="img">
        <img src="/images/asserts/campari-thumb-8.jpg" alt="">
      </div>
      <p class="info">{{order.products[0].CNName}}{{order.products[0].ENName}}</p>
    </div>
    <div class="g-2 g-list" v-else @click="toDetail">
      <div class="hide-scroll-bar-horizontal">
        <ul>
          <li v-for="(p, i) in order.products" :key="i">
            <img src="/images/asserts/campari-thumb-11.jpg" alt="">
          </li>
        </ul>
      </div>
    </div>
    <p class="g-3">
      共{{count}}件商品 实付款: <i>{{order.total | currency('￥',2)}}</i>
    </p>
    <p class="g-4">
      <a href="javascript:;" v-if="order.status == 1">查看物流</a>
      <a href="javascript:;" v-if="order.status == 0">继续支付</a>
      <a href="javascript:;" v-if="order.status != 0">再次购买</a>
    </p>
  </div>
</template>
<script>
  import { ORDER_STATUS } from '../lib/constant'
  export default {
    props: {
      order: Object
    },
    data () {
      return {
        os: ORDER_STATUS
      }
    },
    computed: {
      count () {
        let count = 0
        this.order.products.forEach(item => {
          count += item.count
        })
        return count
      }
    },
    methods: {
      toDetail () {
        this.$router.push({name: 'order-detail', params: {on: this.order.orderNumber}})
      }
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
  @import "../styles/theme";
  .order-ed-item {
    width: 100%;
    display: flex;
    flex-direction: column;
    border-top: 1px solid $light-border-color;
    border-bottom: 1px solid $light-border-color;
    background-color: #ffffff;
    margin-bottom: .5rem;
    &>* {
      width: 100%;
    }
  }
  .g-1 {
    display: flex;
    justify-content:flex-end;
    padding: .3rem .8rem;
    font-size: .7rem;
    align-items: center;
    color: $price-gray-color;
    a {
      display: block;
      padding: .1rem;
      color: #cccccc;
      width: 24px;
      margin-left: 1rem;
      i {
        width: 100%;
        display: flex;
        justify-content: flex-end;
      }
    }
  }
  .g-2 {
    padding: .4rem 1rem;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background-color: #fafafa;
    .img {
      flex: 0 0 20%;
      border: 1px solid $light-border-color;
    }
    &>p {
      padding-left: .8rem;
      font-size: .8rem;
      line-height: 1.2;
      word-wrap: break-word;
      white-space: normal;
    }
  }
  .g-list {
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
  .g-3 {
    padding: .6rem 1rem;
    text-align: right;
    font-size: .8rem;
    border-bottom: 1px solid $light-border-color;
    i {
      font-size: 1rem;
    }
  }
  .g-4 {
    padding: .4rem 1rem;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    a {
      font-size: .8rem;
      color: $common-red-color;
      border: 1px solid #e47f72;
      border-radius: .2rem;
      padding: .4rem .6rem;
      margin-left: .5rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>
