<template>
  <products-container @loadData="reload">
    <loadmore :auto-fill="false" :bottom-method="load" :bottom-all-loaded="allLoaded"
              :distance-index="1" :max-distance="0"
              @bottom-status-change="handleBottomChange" ref="loadmore">
      <ul class="products-box" v-re-render="'1rem'">
        <li-item v-for="item in onView" :key="item.sku" :item="item"></li-item>
      </ul>
      <div slot="bottom" class="mint-loadmore-bottom">
        <span v-show="bottomStatus !== 'loading'" :class="{ 'rotate': bottomStatus === 'drop' , 'load-arrow': true}">
          <i class="material-icons blue">arrow_upward</i>
        </span>
        <div class="load-spinner" v-show="bottomStatus === 'loading'">
          <spinner :type="0" :size="20" color="rgb(38, 162, 255)"></spinner>
        </div>
      </div>
    </loadmore>
  </products-container>
</template>
<script>
  import LiItem from '../components/li-item.vue'
  import ProductsContainer from '../components/products-container.vue'
  import {Loadmore, Spinner} from 'mint-ui'
  import {query} from '../lib/services'
  import _ from 'lodash'

  export default {
    components: {
      Loadmore,
      Spinner,
      LiItem,
      ProductsContainer
    },
    data () {
      return {
        pageIndex: 0,
        products: [],
        onView: [],
        allLoaded: false,
        bottomStatus: '',
        list: 10
      }
    },
    methods: {
      load () {
        let that = this
        that.__toast()
        setTimeout(() => {
          if (that.pageIndex === that.products.length - 1) {
            that.__toast({
              text: '到底啦！！',
              time: 2000
            })
            that.__bottomLoaded()
            return
          }
          that.pageIndex ++
          that.onView = that.onView.concat(that.products[that.pageIndex])
          that.__bottomLoaded()
        }, 1000)
      },
      handleBottomChange (status) {
        this.bottomStatus = status
      },
      reload (params) {
        let that = this
        if (params && !params.created) {
          that.$router.push({name: 'products2', query: params.data})
          return
        }
        that.pageIndex = 0
        that.allLoaded = false
        query('product/query', params.data)
          .then(data => {
            that.products = _.chunk(data, 8)
            that.onView = that.products[that.pageIndex]
            that.__bottomLoaded()
          })
          .catch(err => {
            console.log(err)
            console.log(err)
          })
      },
      __toast (options) {
        this.$vux.toast.show(Object.assign({
          text: 'Loading...',
          time: 900,
          position: 'middle',
          type: 'text'
        }, options))
      },
      __bottomLoaded () {
        this.$refs.loadmore && this.$refs.loadmore.onBottomLoaded()
      }
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
  @import "../styles/_theme";
  .load-spinner {
    width:20px;
    margin:0 auto;
    display: block;
  }
  .load-arrow i{
    transition: all 300ms;
  }
  .rotate i{
    transform: rotate(180deg);
  }
  .material-icons.blue {
    color: rgb(38, 162, 255);
    font-size: 2rem;
  }
  .products-box {
    width:90%;
    margin:0 auto;
    display: flex;
    justify-content:space-between;
    flex-wrap: wrap;
    padding-bottom:1.1rem;
    li {
      width:47%;
      /*float: left;*/
    }
    /*li:nth-of-type(2n-1) {*/
      /*margin-right:6%;*/
    /*}*/
  }
</style>
