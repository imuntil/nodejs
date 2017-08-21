<template>
  <div class="categories-layer">
    <img class="c-bg" src="../assets/c-all-4.jpg" alt="" width="100%">
    <ul class="c-btns">

      <li><a href="javascript:void(0);"
             :class="{active:route_.type == 1}"
             @click.stop="query({type:1})"></a></li>
      <li><a href="javascript:void(0);"
             :class="{active:route_.type ==2}"
             @click.stop="query({type:2})"></a></li>
      <li><a href="javascript:void(0);"
             :class="{active:route_.type == 3}"
             @click.stop="query({type:3})"></a></li>
      <li><a href="javascript:void(0);"
             :class="{active:route_.type == 4}"
             @click.stop="query({type:4})"></a></li>
      <li><a href="javascript:void(0);"
             :class="{active:route_.type == 5}"
             @click.stop="query({type:5})"></a></li>
      <li><a href="javascript:void(0);"
             :class="{active:route_.type == 6}"
             @click.stop="query({type:6})"></a></li>
      <li><a href="javascript:void(0);"
             :class="{active:route_.type == 7}"
             @click.stop="query({type:7})"></a></li>
    </ul>
  </div>
</template>
<script>
  export default {
    props: {
      replace: {
        type: Boolean,
        default: false
      },
      route_: {
        type: Object
      }
    },
    methods: {
      query (params) {
        this.$emit('query', params)
      }
    }
  }
</script>
<style type="text/scss" lang="scss">
  @import "../styles/_theme.scss";
  .categories-layer {
    position: absolute;
    left:0;
    top:45px;
    width:100%;
    z-index: 99;
    box-shadow: 0 1px 8px #888;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    overflow: hidden;
    .c-btn-hide {
      height:7.7%;
      top:0;
      right:5.3%;
      width:31.1%;
    }
    ul {
      position: absolute;
      bottom:0;
      width:100%;
      height:100%;
      li {
        width:33.3%;
        height:33%;
        float: left;
        a{
          width:100%;
          height:100%;
          display: block;
        }
        .active {
          border-bottom:2px solid $common-red-color;
          box-shadow: 0 4px 10px -2px $border-gray-color;
        }
      }
      li:nth-child(n + 4) {
        height:33.4%;
      }
    }
  }
</style>
