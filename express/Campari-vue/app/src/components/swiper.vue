<template>
  <div class="swiper-container">
    <div class="swiper-wrapper">
      <slot></slot>
    </div>
    <div id="pagination" class="swiper-pagination" v-if="pagination"></div>
  </div>
</template>
<script>
  import Swiper from '../lib/swiper.min'

  export default {
    props: {
      pagination: {
        type: Boolean,
        default: true
      }
    },
    mounted () {
      let config = {
        slidesPerView: 1,
        spaceBetween: 12,
        preloadImages: true,
        loop: true,
        autoplay: 3000
      }
      if (this.pagination) {
        Object.assign(config, { pagination: '.swiper-pagination' })
      }
      /* eslint-disable no-new */
      new Swiper('.swiper-container', config)
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  @import "../lib/swiper.min.css";
  .swiper-container {
    width:100%;
  }
</style>
