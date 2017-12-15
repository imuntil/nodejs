const Coupon = require('../../models/coupon')
const ApiError = require('../error/ApiError')
const ApiErrorNames = require('../error/ApiErrorNames')
const _ = require('lodash')

class CouponController {
  // sys
  // list coupons
  static async listCoupons (ctx, next) {
    console.log('list coupons')
  }
  // add coupons
  static async addCoupon (ctx, next) {
    console.log('新增coupon')
  }
  // edit coupons
  static async editCoupon (ctx, next) {
    console.log('编辑coupon')
  }
  // delete coupons
  static async deleteCoupon (ctx, next) {
    console.log('删除coupon')
  }
  // client
  // 使用优惠券（count - 1）

}

module.exports = CouponController