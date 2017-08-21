<template>
    <ul class="categories-layer-2">
    <li><a href="javascript:void(0);"
           :class="{active:route_.sort == 2}"
           @click.stop="query({flag: 2, sort: 2})">销量最高</a></li>
    <li><a href="javascript:void(0);"
           :class="{active:route_.sort == 3}"
           @click.stop="query({flag: 3, sort: 2})">价格最高</a></li>
    <li><a href="javascript:void(0);"
           :class="{active:route_.sort == 4}"
           @click.stop="query({flag: 3, sort: 1})">价格最低</a></li>
    </ul>
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
  .categories-layer-2 {
    position: absolute;
    top:44px;
    width:50%;
    right:0;
    background-color: #fff;
    z-index: 90;
    li {
      border-bottom:1px solid #e0e0e0;
//      &:last-child {
//        border-bottom:2px solid $common-red-color;
//      }
      a {
        padding: 14px;
        display: block;
        box-sizing: border-box;
        font-size: 0.9rem;
        text-align: center;
        color: #000;
        &.active {
          color: $common-red-color;
        }
      }
    }
    &::after{
     // @include shadow(100%, 10px, 0 4px 6px 0px rgba(0, 0, 0, 0.2));
      width:100%;
      height:10px;
      position: absolute;
      content: '';
      bottom:0;
      left:0;
      box-shadow:0 4px 6px 0px rgba(0, 0, 0, 0.2);

    }
    &::before {
    //  @include shadow(10px, 100%, -3px 1px 2px 0px rgba(0, 0, 0, 0.2));
      width:10px;
      height:100%;
      position: absolute;
      content: '';
      bottom:0;
      left:0;
      box-shadow:-3px 1px 2px 0px rgba(0, 0, 0, 0.2);
    }
  }
</style>
