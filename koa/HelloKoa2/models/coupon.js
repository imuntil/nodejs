// 优惠券
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const couponSchema = new Schema({
  // 优惠券id（每一类优惠券都有一个公用的kid）
  // 格式为 KD-YYMMDD-YYMMDD-\d{4}，
  kid: { type: String, required: true },
  // 使用时间
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  // 使用方式,暂时只考虑满减
  method: {
    achieve: { type: Number, required: true },
    cut: { type: Number, required: true }
  },
  // 适用产品[sku]
  apply: [String],
  // 数量
  count: { type: Number, default: 10000000 }
})

module.exports = mongoose.model('Coupon', couponSchema)