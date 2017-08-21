<template>
  <div class="swiper-slide" @click.stop="slideClick">
    <slot></slot>
  </div>
</template>
<script>
  export default {
    props: {
      index: [String, Number]
    },
    methods: {
      slideClick () {
        this.$emit('slide-click', this.index)
      }
    }
  }
</script>

