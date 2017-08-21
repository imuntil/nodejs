<template>
  <div class="wrapper">
    <div class="main-container">
      <div class="top-box hide-scroll-bar">
        <div v-re-render="'.1rem'">
          <div class="top-container">
            <header class="section">
              <swiper class="swiper-box" loop :list="p.pics"
                      :show-desc-mask="false" dots-position="center"
                      :aspect-ratio="1"></swiper>
              <div class="short-intro-1">
                <p>{{p.ENName}}</p>
                <p>{{p.CNName}}</p>
                <p class="money">{{p.discounted | currency('￥', 0)}}</p>
                <a href="javascript:;" @click="toggleLike">
                  <img v-show="!like" src="../assets/not-like.png" alt="">
                  <img v-show="like" src="../assets/like.png" alt="">
                </a>
              </div>
              <div class="short-intro-2">
                <p>
                  <span>酒精滴度: {{p.alcoholic}}%</span>
                  <i>来自: {{p.origin}}</i>
                </p>
                <p>
                  <span>类别: {{types[p._type]}}</span>
                  <i>重量: {{p.weight}}g</i>
                </p>
                <p>
                  饮用方式：&nbsp;鸡尾酒
                </p>
              </div>
            </header>
            <div class="detail-intro section">
              <p>
                <img src="/images/asserts/campari-detail-2-1.jpg" alt="" width="100%">
              </p>
              <p>
                <img src="/images/asserts/campari-detail-8-1.jpg" alt="" width="100%">
              </p>
              <P>
                内地大陆的理解哦阿门吗吃饭就水淀粉jfk渡口扼u国家的接口对接覅文件夹开始打机哦
              </P>
            </div>
            <div class="after-sales section">
              <partical-title>配送及售后说明</partical-title>
              <ul>
                <li>本产品支持退款;</li>
                <li>快递信息：顺丰、圆通、韵达；</li>
                <li>邮费信息：包邮；</li>
                <li>发货周期：48小时内发货，节假日暂缓；</li>
                <li>发货范围：全国可送（不含港澳台地区、西藏、新疆、宁夏、青海）；</li>
              </ul>
              <div class="pic">
                <img src="../assets/detail-sign.jpg" alt="">
              </div>
            </div>
            <div class="may-like section">
              <partical-title>猜你喜欢</partical-title>
              <ul>
                <li-item v-for="item in mayLikes" :item="item" :key="Math.random()"></li-item>
              </ul>
            </div>
          </div>
          <palette-com></palette-com>
        </div>
      </div>
      <div class="bottom-box">
        <a href="javascript:;" @click="addToCart"><span>加入购物车</span></a>
        <a href="javascript:;" @click="buyNow"><span>立即购买</span></a>
      </div>
    </div>
  </div>
</template>
<script>
  import {Swiper} from 'vux'
  import ParticalTitle from '../components/partical-title.vue'
  import LiItem from '../components/li-item.vue'
  import PaletteCom from '../components/palette-com.vue'
  import {PaletteButton} from 'mint-ui'
  import { query } from '../lib/services'
  import {
    TYPES,
    USER_CHECK_LOGIN_A,
    DESTINATION,
    CART_ADD_ITEM_A,
    SHOW_TOAST,
    CART_ADD_BUY_NOW
  } from '../lib/constant'
  import { mapState } from 'vuex'
  export default {
    components: {
      Swiper,
      ParticalTitle,
      LiItem,
      PaletteButton,
      PaletteCom
    },
    data () {
      return {
        list: [
          {
            url: 'javascript:;',
            img: '/images/asserts/campari-thumb-19.jpg'
          },
          {
            url: 'javascript:;',
            img: '/images/asserts/campari-thumb-18.jpg'
          },
          {
            url: 'javascript:;',
            img: '/images/asserts/campari-thumb-12.jpg'
          }
        ],
        like: false,
        mayLikes: [
          {}, {}, {}, {}
        ],
        sku: this.$route.params['sku'],
        p: {},
        types: TYPES
      }
    },
    computed: {
      ...mapState({
        user: (state) => state.user.user
      })
    },
    methods: {
      /**
       * 加入购物车
       * 是否登录，yes, add cart; no, login
       */
      addToCart () {
        let that = this
        //  没有登录
        if (!that.user || !that.user._id) {
          that.__fetchUser(that.__addToCart)
          return false
        }
        //  已经登录
        that.__addToCart()
      },
      toggleLike () {
        console.log('xx')
      },
      buyNow () {
        let that = this
        if (!that.user || !that.user._id) {
          return that.__fetchUser(that.__buyNow)
        }
        this.__buyNow()
      },
      __buyNow () {
        let that = this
        that.$store.commit(CART_ADD_BUY_NOW, Object.assign(that.p, {count: 1}))
        that.$router.push({name: 'order', params: {from: 2}})
      },
      __addToCart () {
        let that = this
        this.$store.dispatch(CART_ADD_ITEM_A, {_id: this.user._id, sku: this.p.sku})
          .then(() => {
            that.$store.commit(SHOW_TOAST, {type: 'success', text: '添加成功', width: null})
          })
          .catch(err => {
            console.log(err)
            that.$store.commit(SHOW_TOAST, {type: 'cancel', text: '出错了，稍后再试吧'})
          })
      },
      __fetchUser (cb) {
        let that = this
        that.$store.dispatch(USER_CHECK_LOGIN_A)
          .then(auto => {
            //  没有登录，跳转login
            if (!auto) {
              that.$store.commit(DESTINATION, {name: 'detail'})
              that.$router.push({name: 'login'})
              return false
            }
            //  登录(通过sessionStorage 或着 接口)
            cb()
          })
          .catch(err => {
            //  出错，按照未登录处理
            console.log(err)
            that.$store.commit(DESTINATION, {name: 'detail'})
            that.$router.push({name: 'login'})
          })
      }
    },
    created () {
      //  查询商品详细信息
      let that = this
      query(`product/${this.sku}`)
        .then(data => {
          console.log(data)
          if (!data.pics || !data.pics.length) {
            data.pics = that.list
          }
          that.p = data
        })
        .catch(err => {
          console.log(err)
          that.$vux.alert.show({
            content: '出错了额，点击返回上一页',
            onHide () {
              that.$router.go(-1)
            }
          })
        })
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
  @import "../styles/_theme.scss";
  .main-container {
    display: flex;
    height: 100%;
    width: 100%;
    position: relative;
    flex-direction:column;
  }
  .top-box {
    flex:0 0 91%;
    overflow-y: scroll;
    .top-container{
      background-color: $backgroud-color;
    }
  }
  .section {
    border-bottom:1px solid $border-gray-color;
    border-top:1px solid $border-gray-color;
    margin-bottom:.8rem;
    background-color: #fff;
  }
  header {
    .short-intro-1 {
      width:90%;
      margin: 0 auto;
      font-size:1.1rem;
      position: relative;
      padding-bottom:2rem;
      border-bottom:1px solid $border-gray-color;
      p {
        margin-top:.4rem;
        font-weight:600;
        &:first-child {
          margin-top:1rem;
        }
      }
      .money {
        margin-top:1.5rem;
        color: $common-red-color;
      }
      a {
        position: absolute;
        width: 22px;
        top: 0;
        right: 1rem;
        img {
          width:100%;
        }
      }
    }
    .short-intro-2 {
      width: 90%;
      margin: 1.2rem auto;
      p {
        width: 100%;
        display: block;
        overflow: hidden;
        margin-top:.3rem;
        font-size:.9rem;
        color: $price-gray-color;
        box-sizing: border-box;
        padding:.1rem;
        span {
          float: left;
          width: 50%;
        }
        i {
          float: right;
          width: 50%;
          text-align: left;
          padding-left: 10%;
          box-sizing: border-box;
        }
      }
    }
  }
  .detail-intro {
    width: 100%;
    padding:1rem 0;
    line-height: 1.2rem;
    p {
      margin:.6rem auto;
      width: 90%;
      font-size:.9rem;
      color: #444;
      img {
        width: 112%;
        margin-left: -6%;
      }
    }
  }
  .after-sales {
    position: relative;
    ul {
      width: 90%;
      margin:1rem auto;
      padding-bottom:.8rem;
    }
    li {
      font-size:.9rem;
      padding:.1rem .1rem .1rem 1rem;
      color: $price-gray-color;
      line-height:1.2rem;
      position: relative;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      &::before {
        content:' ';
        width: 5px;
        height: 5px;
        background-color: $price-gray-color;
        position: absolute;
        left: 0;
        top: .6rem;
        border-radius: 5px;
      }
    }
    .pic {
      position: absolute;
      right: 2rem;
      top: 4.2rem;
      width:5.5rem;
      img {
        width: 100%;
      }
    }
  }
  .may-like {
    ul {
      width: 90%;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      margin: 1rem auto;
      flex-direction: row;
    }
    li {
      width: 47%;
      margin-bottom: 1rem;
    }
  }
  .bottom-box {
    flex:1 1 auto;
    display: flex;
    a {
      flex: 0 0 50%;
      display: flex;
      justify-content:center;
      align-items: center;
      color: #ffffff;
      background-color: $common-red-color;
      &:first-child {
        color: $common-red-color;
        background-color: #fff;
        border-top:1px solid $border-gray-color;

      }
    }
  }
</style>
