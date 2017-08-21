<template>
  <div class="wrapper hide-scroll-bar">
    <div class="main-container">
      <div class="group">
        <p>
          <label>收货人</label>
          <input type="text" v-validate="'required|min:2|max:15'"
                 v-shaking="submit && errors.has('name')" v-model="model.name"
                 name="name" data-vv-as="姓名" placeholder="请输入收货人的姓名">
        </p>
        <p>
          <label>手机号</label>
          <input name="phone" v-validate="'required|phone'"
                 v-shaking="submit && errors.has('phone')" data-vv-as="手机号码"
                 v-model="model.phone" type="tel" placeholder="请输入收货人的手机号码">
        </p>
        <p>
          <label>标签</label>
          <select v-model="model.label" name="label">
            <option value="">-</option>
            <option value="家">家</option>
            <option value="公司">公司</option>
          </select>
        </p>
      </div>
      <div class="group">
        <p v-shaking="submit && !model.city">
          <a href="javascript:;" @click="popup = true">
            所在地区
            <i v-if="!model.city">请选择 ❯</i>
            <i v-else>{{model.province + '-' + model.city}} ❯</i>
          </a>
        </p>
        <p>
          <textarea name="detail" data-vv-as="详细地址" v-model="model.detail"
                    v-validate="'required|min:5|max:50'" v-shaking="submit && errors.has('detail')"
                    cols="30" rows="4" placeholder="请填写详细地址"></textarea>
        </p>
      </div>

      <a href="javascript:;" class="set-default" @click="model.isDefault = !model.isDefault">
        <i class="material-icons" v-show="model.isDefault">radio_button_checked</i>
        <i class="material-icons" v-show="!model.isDefault">radio_button_unchecked</i>
        默认地址
      </a>

      <a href="javascript:;" class="save" @click="valid">保存</a>
      <popup position="bottom" popup-class="picker-popup" :open="popup">
        <p class="btn-group">
          <a href="javascript:;">取消</a>
          <a href="javascript:;" @click="popup = false">确认</a>
        </p>
        <picker :slots="slots" :visible-item-count="5" @change="addressChange" :values="address"/>
      </popup>
    </div>
  </div>
</template>
<script>
  import popup from 'muse-components/popup'
  import picker from 'muse-components/picker'
  import { citiesData, timeout } from '../../lib/common-tools'
  import { SHOW_TOAST, ADR_ADD_ADDRESS_A, ADR_UPDATE_ADDRESS_A } from '../../lib/constant'
  import { mapState } from 'vuex'
  import _ from 'lodash'
  export default {
    components: {
      popup,
      picker
    },
    data () {
      return {
        submit: false,
        popup: false,
        address: ['北京', '-', '北京'],
        slots: [
          { width: '30%', textAlign: 'right', values: Object.keys(citiesData) },
          { divider: true, content: '-', values: ['-'] },
          { width: '70%', textAlign: 'center', values: ['北京'] }
        ],
        model: {
          name: '',
          phone: '',
          isDefault: false,
          label: '',
          province: '',
          city: '',
          detail: ''
        },
        //  0: add, 1: edit
        status: 0
      }
    },
    computed: {
      ...mapState({
        user: state => state.user.user,
        adrs: state => state.address.ADRS
      })
    },
    methods: {
      addressChange (value, index) {
        console.log(value)
        switch (index) {
          case 0:
            this.model.province = value
            const arr = citiesData[value]
            this.slots[2].values = arr
            this.model.city = arr[0]
            break
          case 2:
            this.model.city = value
            break
        }
        this.address = [this.model.province, '-', this.model.city]
      },
      valid () {
        let that = this
        that.submit = true
        that.$validator.validateAll()
          .then(() => {
            that.submit = false
            if (!that.model.city) {
              that.$store.commit(SHOW_TOAST, '请选择所在地区')
              return
            }
            that.status === 0 ? that.__addToServer() : that.__updateToServer()
          })
          .catch(() => {
            let errors = that.$validator.getErrors().all()
            that.$store.commit(SHOW_TOAST, errors[0])
            that.submit = false
          })
      },
      __addToServer () {
        let that = this
        that.$store.dispatch(ADR_ADD_ADDRESS_A, _.assign(
          { _id: that.user._id },
          that.model
        ))
          .then(() => {
            that.$store.commit(SHOW_TOAST, {
              text: '新增地址成功',
              type: 'success',
              width: null
            })
            timeout(function () {
              that.$router.go(-1)
            }, 500)
          })
          .catch(err => {
            that.$store.commit(SHOW_TOAST, err)
          })
      },
      __updateToServer () {
        let that = this
        that.$store.dispatch(ADR_UPDATE_ADDRESS_A, {
          params: _.assign({_id: that.user._id}, that.model),
          index: this.$route.params['index']
        })
          .then(() => {
            that.$store.commit(SHOW_TOAST, {
              text: '修改地址成功',
              type: 'success',
              width: null
            })
            timeout(function () {
              that.$router.go(-1)
            }, 500)
          })
          .catch(err => {
            this.$store.commit(SHOW_TOAST, err)
          })
      }
    },
    created () {
      let index = +this.$route.params['index']
      if (_.isNumber(index)) {
        let model = this.adrs[this.$route.params['index']]
        if (model) {
          this.model = model
          this.status = 1
        }
      }
    },
    mounted () {
      if (this.status) {
        this.addressChange(this.model.province, 0)
        this.addressChange(this.model.city, 2)
      }
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
  @import "../../styles/_theme";
  .main-container {
    width: 100%;
    position: relative;
  }
  .group {
    margin-top: 1rem;
    border:1px solid $border-gray-color;
    border-radius: .2rem;
    padding: 0 5%;
    p {
      padding: .6rem 0;
      color: #444;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom:1px solid $border-gray-color;
      font-size: .9rem;
      &:last-child {
        border-bottom: none;
      }
    }
    input, select {
      padding: .5rem;
      width: 70%;
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      border: none;
      font-size:.8rem;
      font-family:inherit;
      color: $price-gray-color;
      &::-webkit-input-placeholder {
        font-size: .8rem;
        font-family:inherit;
        color: $price-gray-color;
      }
    }
    a {
      color: #444;
      width:100%;
      display: flex;
      justify-content:space-between;
      padding:.4rem;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      align-items: center;
      font-size: .9rem;
      i {
        color: $price-gray-color;
      }
    }
    textarea {
      width: 100%;
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      border:none;
      resize: none;
      padding: .4rem;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      font-size: 1rem;
      color: $price-gray-color;
      font-family:inherit;
      &::-webkit-input-placeholder {
        font-family:inherit;
        font-size:1rem;
        color: $price-gray-color;
      }
    }
  }
  .set-default {
    width: 100%;
    padding: 1rem 5%;
    color: #444;
    font-size:.9rem;
    border: 1px solid $border-gray-color;
    border-radius: .2rem;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-top: 1rem;
    i {
      font-size:1.2rem;
      margin-right: 1rem;
      color: $common-red-color;
    }
  }
  .save {
    width: 90%;
    padding: .9rem 5%;
    color: $common-red-color;
    font-size: 1rem;
    border: 1px solid $common-red-color;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    text-align: center;
    display: block;
    border-radius: .2rem;
    margin: 2rem auto 0;
  }
</style>
<style type="text/scss" lang="scss">
  @import "../../styles/_theme";
  .picker-popup {
    width: 100%;
    padding: .5rem 5% 5% 5%;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    .btn-group {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid $border-gray-color;
      padding-bottom: .4rem;
      a {
        padding: .3rem .4rem;
        color: #71CBEA;
        display: block;
        font-size: .9rem;
      }
      a:first-child {
        color: $common-red-color;
        visibility: hidden;
      }
    }
  }
  .mu-picker-item {
    font-size:.9rem !important;
  }
</style>
