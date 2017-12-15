const router = require('koa-router')()
const CouponController = require('../../app/controllers/coupon-controller')

router
  .get('', CouponController.listCoupons)
  .post('', CouponController.addCoupon)
  .put('/:kid', CouponController.editCoupon)
  .delete('/:kid', CouponController.deleteCoupon)

module.exports = router