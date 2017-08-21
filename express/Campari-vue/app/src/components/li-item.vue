<template>
    <li :class="customClass">
        <a href="javascript:void(0);" @click="clicked">
            <img :src="img" alt="" width="100%">
            <p class="en">{{item.ENName || 'no name'}}</p>
            <p class="cn">{{item.CNName || '无名'}}</p>
            <p class="oth">{{item.content || '750'}}ml <i>{{item.discounted || 180 | currency('￥', 0)}}</i></p>
        </a>
    </li>
</template>
<script>
    export default {
      props: {
        item: Object,
        customClass: String
      },
      methods: {
        clicked () {
          this.$router.push({name: 'detail', params: {sku: this.item.sku}})
          this.$emit('item-clicked', 1)
        }
      },
      data () {
        return {
          img: '/images/asserts/campari-thumb-10.jpg'
        }
      }
    }
</script>
<style lang="scss" type="text/scss" scoped>
  @import "../styles/_theme.scss";
  a {
    display: block;
    /*box-shadow: 1px 2px 8px 2px #dddddd;*/
    box-sizing: border-box;
    padding:.2rem;
    p {
      width:100%;
      text-align: left;
      margin-top: .3rem;
      padding-left: .3rem;
      box-sizing: border-box;
      font-size:$font-size - .1rem;
      color: #000;
    }
    .oth {
      margin-top:.5rem;
      font-size:$font-size - .2rem;
      margin-bottom:.6rem;
      i {
        color: $common-red-color;
        float: right;
        margin-right:.3rem;
      }
    }
  }
</style>
