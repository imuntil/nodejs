<template>
  <div class="wrapper hide-scroll-bar">
    <div class="main-container">
      <div class="adr-box" v-for="(adr, index) in adrs" :key="index">
        <div class="up" @click="chooseAdr(index)" :class="{'is-chosen': adr._id == chosen._id}">
          <p class="p1">
            <span>{{adr.name}}</span>
            <span><i>{{adr.phone | phone}}</i><i>{{adr.label || '无'}}</i></span>
          </p>
          <p class="adr-detail">{{adr.province}}-{{adr.city}}-{{adr.detail}}</p>
        </div>
        <div class="down">
          <div class="left">
            <a href="javascript:;" @click.stop="setDefault(adr, index)">
              <i class="material-icons" v-show="adr.isDefault">radio_button_checked</i>
              <i class="material-icons" v-show="!adr.isDefault">radio_button_unchecked</i>
              默认地址
            </a>
          </div>
          <div class="right">
            <router-link :to="{name: 'edit-adr', params: {index: index}}">编辑</router-link>
            <a href="javascript:;" @click.stop="removeAdr(adr._id, index)">删除</a>
          </div>
        </div>
      </div>
      <router-link class="add-address" :to="{name: 'edit-adr'}">
        增加收货地址
        <i class="material-icons">keyboard_arrow_right</i>
      </router-link>
    </div>
  </div>
</template>
<script>
  import { Button } from 'mint-ui'
  import { ADR_FETCH_ADDRESSES_A, ADR_DELETE_ADDRESS_A,
    SHOW_TOAST, ADR_SET_DEFAULT_ADDRESS_A,
    ADR_SET_CHOSEN_ADDRESS, ADR_CHOSEN_ADDRESS_G } from '../../lib/constant'
  import { mapState } from 'vuex'
  export default {
    components: {
      mtButton: Button
    },
    data () {
      return {}
    },
    computed: {
      ...mapState({
        user: state => state.user.user,
        adrs: state => state.address.ADRS,
        chosen: state => state.address.chosenAdr
      }),
      chosen () {
        return this.$store.getters[ADR_CHOSEN_ADDRESS_G]
      }
    },
    methods: {
      removeAdr (id, index) {
        let that = this
        that.$vux.confirm.show({
          content: '确定要删除这个地址么?',
          onConfirm () {
            that.$store.dispatch(ADR_DELETE_ADDRESS_A, {_id: that.user._id, id: id, index: index})
              .then(() => {})
              .catch(err => {
                that.$store.commit(SHOW_TOAST, err)
              })
          }
        })
      },
      setDefault (adr, index) {
        let that = this
        if (adr.isDefault) return
        that.$store.dispatch(ADR_SET_DEFAULT_ADDRESS_A, {id: adr._id, index: index, _id: that.user._id})
          .then(() => {
          })
          .catch(err => {
            that.$store.commit(SHOW_TOAST, err)
          })
      },
      chooseAdr (index) {
        this.$store.commit(ADR_SET_CHOSEN_ADDRESS, {index: index})
        this.$router.go(-1)
      }
    },
    created () {
      if (!this.adrs || !this.adrs.length) {
        this.$store.dispatch(ADR_FETCH_ADDRESSES_A, {_id: this.user._id})
          .then(() => { })
          .catch(err => {
            console.log(err)
            this.$router.go(-1)
          })
      }
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
  @import "../../styles/_theme.scss";
  .main-container {
    display: flex;
    /*height: 100%;*/
    width: 100%;
    position: relative;
    flex-direction:column;
  }
  .adr-box {
    display: flex;
    flex-direction: column;
    font-size: 1rem;
    width: 100%;
    padding: 1rem;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    border: 1px solid $border-gray-color;
    border-radius: .3rem;
    margin-top: 1rem;
    box-shadow: 0 1px 1px 1px #eee;
    .up {
      border-bottom: 1px solid #eaeaea;
      padding-bottom: .5rem;
    }
    .up.is-chosen {
      border-bottom: 1px solid $common-red-color;
    }
    p {
      padding: .2rem;
      margin-bottom: .4rem;
      font-size:.9rem;
      color: #444;
      word-break: break-all;
    }
    .p1 {
      display: flex;
      justify-content: flex-start;
      &>span:nth-child(1) {
        flex: 0 0 55%;
      }
      &>span:nth-child(2) {
        flex: 0 0 45%;
        display: flex;
        justify-content: space-between;
        i {
          color: #71CBEA;
          border: 1px solid #71CBEA;
          border-radius: .2rem;
          padding:.1rem .2rem;
          font-size: .8rem;
        }
      }
    }
    .down {
      padding-top: 1rem;
      display: flex;
      .left {
        flex: 0 0 50%;
        a {
          display: flex;
          justify-content:flex-start;
          align-items:center;
          color: #000;
          font-size: .9rem;
          i {
            color: $common-red-color;
            font-size: 1.5rem;
            margin-right: .5rem;
          }
        }
      }
      .right {
        flex: 0 0 50%;
        display: flex;
        justify-content: flex-end;
        a {
          font-size:.9rem;
          display: block;
          padding:.4rem .6rem;
          color: #71CBEA;
          border: 1px solid #71CBEA;
          border-radius: .2rem;
          margin-left: 1rem;
          &:last-child {
            color: $common-red-color;
            border-color: $common-red-color;
          }
        }
      }
    }
  }
  .add-address {
    width: 100%;
    display: flex;
    color: #000;
    justify-content: space-between;
    align-items: center;
    padding:.8rem 5%;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    margin: 2rem 0;
    border: 1px solid $border-gray-color;
    border-radius: .2rem;
    i {
      font-size: 1.2rem;
    }
  }
</style>
