const Coupon = require('../../models/coupon')
const ApiError = require('../error/ApiError')
const ApiErrorNames = require('../error/ApiErrorNames')
const _ = require('lodash')
const { iv } = require('../../lib/cc')

class CouponController {
  // sys
  /**
   * GET: api/sys/coupon
   * 获取优惠券列表
   * @param ctx
   * @param next
   * @return {Promise.<void>}
   */
  static async listCoupons (ctx, next) {
    console.log('list coupons')
    const coupons = await Coupon.find()
      .sort('-created')
      .select('-__v')
      .lean()
      .exec()
    ctx.body = {
      data: coupons
    }
  }

  /**
   * POST
   * 新增coupon
   * body = { start, end, method, apply, count?, name, detail }
   * @param ctx
   * @param next
   * @return {Promise.<void>}
   */
  static async addCoupon (ctx, next) {
    console.log('新增coupon')
    const { start, end, method, apply, count, name, detail } = ctx.request.body
    const coupon = new Coupon({
      start, end, method, apply, count, name, detail, created: Date.now(), kid: `KD-${+Date.now()}`
    })
    const _new = await coupon.save()
    ctx.body = {
      data: _.omit(_new.toObject(), '__v')
    }
  }

  /**
   * PUT
   * 编辑coupon
   * params = { kid }
   * body = { name?, detail?, start?, end?, method?, apply? }
   * @param ctx
   * @param next
   * @return {Promise.<void>}
   */
  static async editCoupon (ctx, next) {
    console.log('编辑coupon')
    const kid = ctx.params.kid
    iv(kid)
    const body = _.omit(ctx.request.body, ['_id', 'kid', 'created'])
    const old = await Coupon.findById( kid ).exec()
    if (!old) throw new Error('优惠券不存在')
    for (const k in body) {
      if (body[k] === undefined) continue
      old[k] = body[k]
    }
    const _new = await old.save()
    ctx.body = {
      data: _.omit(_new.toObject(), '__v')
    }
  }

  /**
   * DELETE
   * 删除coupon
   * params = { kid }
   * @param ctx
   * @param next
   * @return {Promise.<void>}
   */
  static async deleteCoupon (ctx, next) {
    console.log('删除coupon')
    const { kid } = ctx.params
    iv(kid)
    try {
      const res = await Coupon.remove({ _id: kid }).exec()
      const { result: { n } } = res
      ctx.body = {
        message: `成功删除${n}条数据`
      }
    } catch (err) {
      throw err
    }
  }
  // client
  // 使用优惠券（count - 1）

}

module.exports = CouponController