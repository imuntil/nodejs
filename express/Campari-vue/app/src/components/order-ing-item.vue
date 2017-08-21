<template>
  <div class="pro-info">
    <div class="img">
      <img src="/images/asserts/campari-thumb-12.jpg" alt="">
    </div>
    <div class="r">
      <p class="cn">{{item.CNName}}</p>
      <p class="en">{{item.ENName}}</p>
      <i>净含量：{{item.content}}ml</i>
      <p v-if="!canEdit" class="last"><span>{{item.price | currency('￥',0)}}</span> <em>x{{item.count}}</em></p>
      <p v-else class="last">
        <span>{{item.price | currency('￥',0)}}</span>
        <z-number :initValue="item.count" @value-change="change"></z-number>
      </p>
    </div>
  </div>
</template>
<script>
  import ZNumber from '../components/z-number.vue'
  export default {
    components: {
      ZNumber
    },
    props: {
      item: {
        type: Object,
        required: true
      },
      data () {
        return {
          count: 1
        }
      },
      canEdit: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      change (value) {
        this.$emit('count-change', value)
      }
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
  @import "../styles/theme";
  .pro-info {
    display: flex;
    flex-direction: row;
    padding-bottom: .8rem;
    border-bottom: 1px solid $light-border-color;
    .img {
      flex: 0 0 25%;
      border: 1px solid $light-border-color;
    }
    .r {
      box-sizing: border-box;
      padding-left: .4rem;
      padding-top: .2rem;
      display: flex;
      flex-direction: column;
      align-content: space-between;
      flex: 0 0 75%;
      &>* {
        flex: auto;
        font-size: .8rem;
      }
      p {
        width: 100%;
        font-size: .8rem;
        &.last {
          display: flex;
          justify-content:space-between;
          align-items: center;
          span {
            color: $common-red-color;
          }
          em {
            color: #444444;
            text-align: right;
          }
        }
      }
      i {
        font-size: .7rem;
        color: $price-gray-color;
      }
    }
  }
</style>
