<template>
  <li class="li-wrapper">
    <div class="img-box">
      <img src="/images/asserts/campari-thumb-11.jpg" alt="" width="100%">
    </div>
    <div class="right-box">
      <div class="text-group">
        <p>{{item.ENName}}</p>
        <p>{{item.CNName}}</p>
        <p class="_3th">{{item.discounted | currency('￥', 0)}}  <i>{{item.content}}ml</i></p>
      </div>
      <div class="btn-group">
        <a href="javascript:;" class="add-cart" @click="addToCart">加入购物车</a>
        <a href="javascript:;" class="buy-now">立即购买</a>
      </div>
    </div>
  </li>
</template>
<script>
  import { mapState } from 'vuex'
  import { CART_ADD_ITEM_A, SHOW_TOAST, USER_CHECK_LOGIN_A, DESTINATION } from '../lib/constant'
  export default {
    props: {
      item: Object
    },
    computed: {
      ...mapState({
        user: state => state.user.user
      })
    },
    methods: {
      addToCart () {
        let that = this
        //  没有登录
        if (!that.user || !that.user._id) {
          that.__fetchUser()
          return false
        }
        //  已经登录
        that.__addToCart()
      },
      __addToCart () {
        let that = this
        this.$store.dispatch(CART_ADD_ITEM_A, {_id: this.user._id, sku: this.item.sku})
          .then(() => {
            that.$store.commit(SHOW_TOAST, {type: 'success', text: '添加成功', width: null})
          })
          .catch(err => {
            console.log(err)
            that.$store.commit(SHOW_TOAST, {type: 'cancel', text: '出错了，稍后再试吧'})
          })
      },
      __fetchUser () {
        let that = this
        that.$store.dispatch(USER_CHECK_LOGIN_A)
          .then(auto => {
            //  没有登录，跳转login
            if (!auto) {
              that.$store.commit(DESTINATION, {name: 'products2'})
              that.$router.push({name: 'login'})
              return false
            }
            //  登录(通过sessionStorage 或着 接口)
            that.__addToCart()
          })
          .catch(err => {
            //  出错，按照未登录处理
            console.log(err)
            that.$store.commit(DESTINATION, {name: 'products2'})
            that.$router.push({name: 'login'})
          })
      }
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
  @import "../styles/_theme";
  li.li-wrapper {
    width: 100%;
    padding:.5rem;
    display: flex;
    box-sizing: border-box;
    // border-top: 1px solid $border-gray-color;
    // border-bottom: 1px solid $border-gray-color;
    margin-bottom: .6rem;
    background-color: #fff;
  }
  .img-box {
    flex: 0 0 35%;
  }
  .right-box {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding-left:1rem;
    flex: 0 0 65%;
    display: flex;
    flex-direction: column;
    .text-group {
      flex: auto;
      p {
        font-size: .95rem;
        margin-top: .4rem;
        font-weight: 600;
      }
      ._3th {
        color: $common-red-color;
        i {
          font-weight:normal;
          color: #444;
          font-size: .85rem;
          margin-left: 1rem;
        }
      }
    }
    .btn-group {
      width: 100%;
      overflow: hidden;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      flex: auto;
      padding-bottom:.5rem;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      a {
        float: left;
        color: $common-red-color;
        font-size:.9rem;
        display: block;
        background-color: #fff;
        border-radius: .3rem;
        padding: .4rem .6rem;
        border:1px solid $common-red-color;
      }
      .buy-now {
        background-color: $common-red-color;
        color: #ffffff;
        margin-right:.5rem;
      }
    }
  }
</style>
