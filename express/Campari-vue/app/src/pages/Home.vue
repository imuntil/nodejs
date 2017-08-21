<template>
  <div class="wrapper hide-scroll-bar">
    <div class="main-container">
      <header>
        <div class="title">
          <span>最新推荐</span>
          <em>每周福利、精选指南</em>
        </div>
        <swiper loop :aspect-ratio="0.75" class="swiper-box" dots-position="left">
          <swiper-item class="slide-box">
            <img src="../assets/home-swiper.jpg" width="100%" alt="">
            <div class="info">
              <p class="en">Campari</p>
              <p class="cn">金巴利苦味利口酒</p>
              <p class="tip"><i>热卖推荐</i>独一无二的意大利红色烈酒/满350送酒杯套装</p>
            </div>
          </swiper-item>
          <swiper-item class="slide-box">
            <img src="../assets/home-swiper.jpg" width="100%" alt="">
            <div class="info">
              <p class="en">Campari</p>
              <p class="cn">金巴利苦味利口酒</p>
              <p class="tip"><i>热卖推荐</i>独一无二的意大利红色烈酒/满350送酒杯套装</p>
            </div>
          </swiper-item>
          <swiper-item class="slide-box">
            <img src="../assets/home-swiper.jpg" width="100%" alt="">
            <div class="info">
              <p class="en">Campari</p>
              <p class="cn">金巴利苦味利口酒</p>
              <p class="tip"><i>热卖推荐</i>独一无二的意大利红色烈酒/满350送酒杯套装</p>
            </div>
          </swiper-item>
        </swiper>
      </header>
      <div class="selling section">
        <div class="theme">
          <span>热卖排行</span>
          <em>大家都在买什么</em>
        </div>
        <div class="more">
          <a href="javascript:;">查看更多 <i>❯</i></a>
        </div>
        <ul>
          <li-item v-for="item in sellingLists" :key="Math.random()" :item="item"></li-item>
        </ul>
      </div>
      <div class="cocktail section">
        <div class="theme">
          <span>经典鸡尾酒</span>
          <em>详细配方全知道</em>
        </div>
        <div class="more">
          <a href="javascript:;">查看更多 <i>❯</i></a>
        </div>
        <ul>
          <cocktail-item v-for="item in [{}, {}, {}]" :key="Math.random()"
                         :info="false"
                         :item="item"></cocktail-item>
        </ul>
      </div>
      <div class="discount section">
        <div class="theme">
          <span>折扣</span>
          <em>打折啦！！</em>
        </div>
        <div class="more">
          <a href="javascript:;">查看更多 <i>❯</i></a>
        </div>
        <ul>
          <li-item v-for="item in discountLists" :key="Math.random()" :item="item"></li-item>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
//  import Swiper from '../components/swiper.vue'
//  import SwiperSlide from '../components/swiper-slide.vue'
  import {Swiper, SwiperItem} from 'vux'
  import LiItem from '../components/li-item.vue'
  import CocktailItem from '../components/cocktail-item.vue'
  import {query} from '../lib/services'

  export default {
    components: {
      Swiper,
      SwiperItem,
      LiItem,
      CocktailItem
    },
    data () {
      return {
        sellingLists: [],
        discountLists: []
      }
    },
    methods: {
      swiperClick (index) {
        console.log(index, '')
      }
    },
    created () {
      let that = this
      query('product/query', {flag: 2, sort: 2, limit: 4})
        .then(data => {
          that.sellingLists = data
        })
        .catch(err => {
          console.log(err)
        })
      query('product/query', {flag: 3, sort: 1, limit: 2})
        .then(data => {
          that.discountLists = data
        })
    }
  }

</script>
<style lang="scss" type="text/scss" scoped>
  @import "../styles/_theme.scss";
  .main-container {
    width:90%;
    margin:0 auto;
    padding-bottom: 30px;
  }
  header {
    width:100%;
    padding:24px 0 16px 0;
    overflow: hidden;
  }
  .title {
    width:100%;
    text-align: left;
  }
  .title span {
    font-size: $font-size + 0.2rem;
    font-weight: 700;
    display: inline-block;
    width:100%;
    margin-bottom:8px;
  }
  .title em {
    color: $price-gray-color;
    width:100%;
    font: {
      size: $font-size - 0.3rem;
      style: normal;
    }
  }
  .swiper-box {
    width:100%;
    clear: both;
    margin-top:20px;
    position: relative;
    .slide-box {
      .info {
        margin-top:6px;
      }
      p {
        width:100%;
        margin-top:6px;
        font:{
          size: $font-size - .2rem;
          weight: 600;
        }
      }
      .tip {
        font:{
          size: $font-size - .3rem;
          weight: normal;
        }
        color: $price-gray-color;
        margin-top: 8px;
        white-space: nowrap;
        i {
          color: $common-red-color;
          padding-right: 10px;
        }
      }
    }
  }

  .section {
    width:100%;
    position: relative;
    overflow: hidden;
    border-top:1px solid $border-gray-color;
    padding:24px 0;
    .theme {
      width:50%;
      margin-bottom:10px;
      float: left;
      span {
        display: inline-block;
        width:100%;
        font-size:$font-size + .2rem;
        font-weight: 700;
        margin-bottom: 8px;
      }
      em {
        color: $price-gray-color;
        font-size: $font-size - .3rem;
        width: 100%;
      }
    }
    .more {
      margin-top:5px;
      width:50%;
      float: right;
      font-size: $font-size - .1rem;
      text-align: right;
      a {
        color: $common-red-color;
        padding:5px;
      }
    }
  }
  .selling, .discount {
    ul {
      width:100%;
      display: flex;
      justify-content:space-between;
      flex-wrap: wrap;
      li {
        width:47%;
        margin-bottom:1rem;
      }
    }
  }
  .cocktail ul {
    width:100%;
    display: flex;
    justify-content:space-between;
    li {
      width:30%;
    }
  }
</style>
<style type="text/scss" lang="scss">
  #pagination {
    text-align: left;
    padding-left: 10px;
    bottom: 30%;
    box-sizing: border-box;
    span {
      background: #ffffff;
      width: 5px;
      height: 5px;
      opacity: 1;
    }
    .swiper-pagination-bullet-active {
      border:1px solid #e41035;
    }
  }

  .swiper-box.vux-slider > .vux-indicator-left {
    bottom: 30%;
  }
</style>
