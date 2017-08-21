<template>
  <div class="wrapper">
    <div class="main-container">
      <tab active-color="#E43F45" bar-active-color="#E43F45">
        <tab-item @on-item-click="tabChange(0)" selected>全部</tab-item>
        <tab-item @on-item-click="tabChange(1)">待付款</tab-item>
        <tab-item @on-item-click="tabChange(2)">待收货</tab-item>
        <tab-item @on-item-click="tabChange(3)">已完成</tab-item>
        <tab-item @on-item-click="tabChange(4)">已取消</tab-item>
      </tab>
      <div class="order-wrap">
        <div class="order-box hide-scroll-bar">
          <order-ed-item v-for="(o, i) in orders" :order="o" :key="i"></order-ed-item>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import OrderEdItem from '../../components/order-ed-item.vue'
  import { Tab, TabItem } from 'vux'
  import { order } from '../../lib/services'
  import { mapState } from 'vuex'
  export default {
    components: {
      OrderEdItem,
      Tab,
      TabItem
    },
    data () {
      return {
        orders: []
      }
    },
    computed: {
      ...mapState({
        user: state => state.user.user
      })
    },
    methods: {
      tabChange (tab) {
        let str = ''
        switch (+tab) {
          //  全部
          case 0:
            break
          case 1:
            //  未付款
            str = 0
            break
          case 2:
            //  待收货
            str = 1
            break
          case 3:
            //  已完成
            str = 1
            break
          case 4:
            //  已取消
            str = -2
            break
        }
        this.__check(str)
      },
      __check (str) {
        let that = this
        order.checkOrder({_id: this.user._id, str: str})
          .then(res => {
            that.orders = res
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    created () {
      this.__check('')
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
  @import "../../styles/theme";
  .main-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    background-color: #F2FFFD;
    overflow: hidden;
    .order-wrap {
      position: relative;
      flex: 1;
    }
    .order-box {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      overflow-y: scroll;
    }
  }
</style>
