<template>
  <div class="wrapper">
    <div class="main-container">
      <header>
        <tab>
          <tab-item @on-item-click="ls(!l1s, false)" class="left" selected>产品分类 <span>▼</span></tab-item>
          <tab-item @on-item-click="ls(false, !l2s)">智能排序 <span>▼</span></tab-item>
        </tab>
      </header>
      <div class="items-box hide-scroll-bar">
        <slot></slot>
      </div>
      <transition mode="out-in" enterActiveClass="animated fadeIn" leaveActiveClass="animated fadeOut">
        <filter-layer :route_="route_" @query="query" v-show="l1s"></filter-layer>
      </transition>
      <transition mode="out-in" enterActiveClass="animated fadeIn" leaveActiveClass="animated fadeOut">
        <filter-layer2 :route_="route_" @query="query" v-show="l2s"></filter-layer2>
      </transition>
    </div>
  </div>
</template>
<script>
  import FilterLayer from '../components/filter-layer@products.vue'
  import FilterLayer2 from '../components/filter-layer2@products.vue'
  import {Tab, TabItem} from 'vux'
  import _ from 'lodash'

  export default {
    components: {
      FilterLayer,
      FilterLayer2,
      Tab,
      TabItem
    },
    props: {
      params: {
        type: Object,
        default () {
          return {
            flag: 1,
            sort: 2,
            type: ''
          }
        }
      }
    },
    data () {
      return {
        l1s: false,
        l2s: false,
        route_: {},
        pageIndex: 0
      }
    },
    methods: {
      ls (...shows) {
        [this.l1s, this.l2s] = shows
      },
      query (params) {
        this.params = _.assign(this.params, params)
        this.l1s = false
        this.l2s = false
        this.$emit('loadData', {data: this.params, created: false})
      }
    },
    created () {
      this.$emit('loadData', {data: this.params, created: true})
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
  @import "../styles/_theme";
  .main-container {
    position: relative;
    height: 100%;
    width: 100%;
  }
  .items-box {
    height: calc(100% - 90px);
    overflow: scroll;
  }
  .placeholder {
    width: 100%;
    height: 1px;
  }
</style>
