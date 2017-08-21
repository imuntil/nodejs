<template>
  <div class="z-number-box" :class="classAtr">
    <a class="m" href="javascript:;" @click="minus" :class="{'z-disable': value <= range.min}">
      <i>－</i>
    </a>
    <span>
      <input type="number" v-model="value" @blur="onBlur" @textInput="input">
    </span>
    <a class="p" href="javascript:;" @click="plus" :class="{'z-disable': value >= range.max}">
      <i>＋</i>
    </a>
  </div>
</template>
<script>
  import _ from 'lodash'
  export default {
    props: {
      initValue: {
        type: Number,
        default: 1
      },
      range: {
        type: Object,
        default () {
          return {
            min: 1,
            max: 99999999
          }
        }
      },
      classAtr: {
        type: String
      },
      tac: {
        type: Number,
        default: 1
      }
    },
    data () {
      return {
        value: null
      }
    },
    methods: {
      onBlur () {
        console.log(this.value)
        if (!_.isNumber(+this.value)) {
          this.value = this.range.min
        }
        this.value < this.min && (this.value = this.min)
        this.value > this.max && (this.value = this.max)
        this.__emit()
      },
      input (e) {
        if (!/^[\d+-]{1}$/.test(e.data)) {
          e.preventDefault()
        }
      },
      minus () {
        if (this.value <= this.range.min) return
        this.value -= this.tac
        this.__emit()
      },
      plus () {
        if (this.value >= this.range.max) return
        this.value += this.tac
        this.__emit()
      },
      __emit () {
        this.$emit('value-change', this.value)
      }
    },
    created () {
      this.value = this.initValue
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
  .z-number-box {
    display: flex;
    flex-direction:row;
    align-items:center;
    height: 1.5rem;
    a{
      border:1px solid #dddddd;
      /*padding:.3rem .35rem;*/
      color: #000;
      /*text-align: center;*/
      height: 1.5rem;
      width: 1.5rem;
      display: flex;
      align-items:center;
      justify-content: center;
      i {
        padding-top: .07rem;
      }
      &.m {
        border-top-left-radius: .3rem;
        border-bottom-left-radius: .3rem;
      }
      &.p {
        border-top-right-radius: .3rem;
        border-bottom-right-radius: .3rem;
      }
    }
    a.z-disable {
      color: #b2b2b2;
    }
    span {
      border-top: 1px solid #d8d8d8;
      border-bottom: 1px solid #d8d8d8;
      height: 1.5rem;
    }
    input {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      justify-content: center;
      box-sizing: border-box;
      /*border-top: 1px solid #d8d8d8;*/
      /*border-bottom: 1px solid #d8d8d8;*/
      height: 100%;
      line-height: 1.2rem;
      width: 2rem;
      /*border-left: none;*/
      /*border-right: none;*/
      border: none;
      text-align: center;
    }
  }
</style>
