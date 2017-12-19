// 优惠券
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const delay = function (time) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, time)
  })
}

const couponSchema = new Schema({
  // 优惠券id（每一类优惠券都有一个公用的kid）
  // 格式为 KD-时间戳，
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
  count: { type: Number, default: 10000000 },
  // 创建时间
  created: { type: Date, default: Date.now() },
  // 优惠券名称
  name: { type: String },
  // 优惠券描述
  detail: { type: String, required: true }
})

couponSchema.pre('save', true, function (next, done) {
  next()
  const { achieve, cut } = this.method
  if (achieve < cut || achieve < 0 || cut < 0) {
    throw new Error('规则不合法')
  }
  if (!this.apply.length) {
    throw new Error('至少需要一个适用产品')
  }
  done()
})

couponSchema.pre('save', true, function (next, done) {
  next()
  const { end, start } = this
  let [s, e] = [ new Date(+start), new Date(+end)]
  if (!+s || !+e) throw new Error('时间格式有误')
  // 如果优惠券可用时间期限早于当前时间，视为优惠券已过期
  // if (e <= +Date.now())
  if (s >= e) throw new Error('优惠券活动结束时间不得早于开始时间')
  else if ( e - s < 1000 * 60 * 30) throw new Error('优惠券活动时间不得短于30min')
  this.start = s
  this.end = e
  done()
})

module.exports = mongoose.model('Coupon', couponSchema)