<template>
  <div class="palette">
    <palette-button :direction="direction" content="+" main-button-style="color: #fff; background-color: #e41035; display: block; line-height: 56px;">
      <div class="my-icon-button" @click="navTo('home')">
        <img class="palette-icon" src="../assets/palette-1.png" alt="" width="30">
      </div>
      <div class="my-icon-button" @click="navTo('products')">
        <img class="palette-icon" src="../assets/palette-2.png" alt="" width="30">
      </div>
      <div class="my-icon-button" @click="navTo('cocktail')">
        <img class="palette-icon" src="../assets/palette-3.png" alt="" width="30">
      </div>
      <div class="my-icon-button" @click="navTo('cart')">
        <img class="palette-icon" src="../assets/palette-4.png" alt="" width="30">
      </div>
      <div class="my-icon-button" @click="navTo('user')">
        <img class="palette-icon" src="../assets/palette-5.png" alt="" width="30">
      </div>
    </palette-button>
  </div>
</template>
<script>
  import {PaletteButton} from 'mint-ui'
  export default {
    components: {
      PaletteButton
    },
    props: {
      direction: {
        type: String,
        default: 'lb'
      }
    },
    methods: {
      navTo (name) {
        this.$router.push({name: name})
      }
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
  @import "../styles/_theme";
  .palette {
    position: fixed;
    right:1rem;
    top:5%;
    .palette-icon {
      border-radius: 50%;
      background-color: #fff;
      border:1px solid $common-red-color;
    }
  }
</style>
