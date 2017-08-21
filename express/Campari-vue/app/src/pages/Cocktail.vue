<template>
  <div class="wrapper">
    <div class="main-container hide-scroll-bar">
      <div v-infinite-scroll="loadMore" infinite-scroll-distance="0">
        <div class="for-scroller">
          <a href="javascript:;" v-for="item in list" :key="item">
            <img src="/images/asserts/cocktail/cocktail-2.jpg" alt="">
            <p>XXXX COCKTAIL-{{item}}</p>
            <p>蓝色夏威夷</p>
            <p>查看详细》</p>
          </a>
          <div class="load-spinner" v-show="spinnerShow">
            <span>
              <spinner :type="0" :size="20" color="rgb(38, 162, 255)"></spinner>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { Spinner } from 'mint-ui'
  export default {
    components: {
      Spinner
    },
    data () {
      return {
        list: 10,
        scrolled: false,
        spinnerShow: false
      }
    },
    methods: {
      loadMore () {
        let that = this
        if (that.scrolled) {
          if (!that.spinnerShow) {
            that.$vux.toast.show({
              text: '到底啦~~',
              time: 1000,
              position: 'middle',
              type: 'text'
            })
          }
          return
        }
        that.spinnerShow = true
        that.scrolled = true
        setTimeout(function () {
          that.list += 10
          that.spinnerShow = false
        }, 1500)
      }
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
  .main-container {
    height:100%;
    overflow: scroll;
  }
  .for-scroller {
    padding-bottom: 65px;
    width:90%;
    margin:0 auto;
    display: flex;
    flex-wrap:wrap;
    justify-content:space-between;
    a {
      width:47%;
      display: block;
      margin-top:2rem;
      box-shadow: 4px 4px 12px 1px #ddd;
      padding-bottom:.4rem;
      border-radius: .4rem;
      img {
        width:100%;
        border-top-left-radius: .4rem;
        border-top-right-radius: .4rem;
      }
      p {
        width:100%;
        text-align: center;
        font-size: .9rem;
        color: #000;
        padding-top:.4rem;
      }
    }
  }
  .load-spinner {
    width:100%;
    margin:2rem auto 0;
    display: block;
    &>span {
      width:20px;
      margin: 0 auto;
      display: block;
    }
  }
</style>
