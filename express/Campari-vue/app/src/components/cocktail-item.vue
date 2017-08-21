<template>
  <li>
    <a href="javascript:void(0)">
      <img src="/images/asserts/cocktail/cocktail-1.jpg" alt="" width="100%">
      <!--<img :src="item.src" alt="" width="100%">-->
      <p class="en">{{item.en || '鸡尾酒'}}</p>
      <p class="cn">{{item.cn || 'cocktail'}}</p>
      <p class="info" v-if="info">查看详情 ❯</p>
    </a>
  </li>
</template>
<script>
  export default {
    props: {
      item: Object,
      info: Boolean
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
  @import "../styles/_theme.scss";
  a {
    display: block;
    p {
      width:100%;
      margin-top: 4px;
      text-align: center;
      font-size: $font-size - .2rem;
      color: #000;
    }
  }
</style>
