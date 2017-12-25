const _ = require('lodash')
const ApiError = require('../error/ApiError')
const ApiErrorNames = require('../error/ApiErrorNames')
const { iv } = require('../../lib/cc')
const Order = require('../../models/order')
const Product = require('../../models/product')
const Address = require('../../models/address')
const User = require('../../models/user')
const io = require('../../utils/socket')
const add2Cycle = require('../../utils/cycleQueue')

// 用户是否存在
async function ifUser (uid) {
	const user = await User.findById(uid).exec()
	if (!user) throw new ApiError(ApiErrorNames.USER_NOT_EXIST)
	return { nick: user.nick, phone: user.phone }
}
// 地址是否存在
async function ifAdr (aid, uid) {
	const adr = await Address
		.findById(aid)
		.select('province city detail phone name _owner')
		.lean()
		.exec()
	if (!adr || uid !== adr._owner) throw new ApiError(ApiErrorNames.ADR_NOT_EXIST_OR_NOT_MATCH_USER)
	return adr
}
// 获取产品
async function  getProducts (body) {
	const ps = await Product
		.find()
		.where('sku')
		.in(body.map(p => p.sku))
    // .select('sku en cn truePrice images content stock')
		.exec()
  if (ps.length !== body.length) throw new ApiError(ApiErrorNames.PRODUCT_NOT_EXIST)
	let total = 0, amount = 0
	const promises = ps.map(async p => {
		const sku = p.sku
		const productInBody = _.find(body, { sku })
		if( productInBody.count > p.stock) throw new ApiError(ApiErrorNames.LACK_OF_STOCK)
		p.stock = p.stock - productInBody.count
		await p.save()
    const product2Res = { ..._.pick(p.toObject(), ['sku', 'en', 'cn', 'truePrice', 'images', 'content']), ...productInBody }
		product2Res.image = product2Res.images[0] || ''
		delete product2Res._id
		total += product2Res.count
		amount += product2Res.truePrice * product2Res.count
		return product2Res
	})
  const products = await Promise.all(promises)
	return { products, amount, total }
}

class OrderController {
	/**
	 * POST: api/users/:uid/order
	 * 下单
	 * params = { uid }
	 * body = { aid<address>, products = [ { sku, count } ], kid<coupon> }
	 * @param ctx
	 * @param next
	 * @returns {Promise.<void>}
	 */
	static async placeOrder (ctx, next) {
		console.log('下单');
		const { uid } = ctx.params
		const { aid, products: body, kid } = ctx.request.body
		// id是否合法
		iv(uid, aid)
		// products是否正确
		if (!_.isArray(body) || !body.length) throw new ApiError(ApiErrorNames.MISSING_PARAMETER_OR_PARAMETER_ERROR)
		// 用户是否存在
		const { nick, phone } = await ifUser(uid)
		// 地址是否存在
		const adr = await ifAdr(aid, uid)
		// 获取产品
		const { total, amount, products } = await getProducts(body)
		const date = new Date()
		const orderNumber = `0${+date}${Math.floor(Math.random() * 10000)}`
		const show = true
		const order = new Order({
			_owner: uid,
			orderNumber,
			date,
			products,
			total,
			amount,
			express: 0,
			status: 0,
			address: adr,
			show,
			_ownerNick: nick,
			_ownerPhone: phone
		})
		const _new = await order.save()
		add2Cycle({ orderNumber, body })
		ctx.body = {
			data: _.pick(_new.toObject(), ['orderNumber', 'total', 'amount', 'express'])
		}
	}

	/**
	 * GET
	 * 查看订单列表
	 * params = { uid }
	 * query = { page, per_page }
	 * @param ctx
	 * @param next
	 * @returns {Promise.<void>}
	 */
	static async listOrders (ctx, next) {
		console.log('order list')
		const { uid } = ctx.params
		const { page = 1, perPage = 20 } = ctx.request.query
		iv(uid)
		const orders = await Order
			.find({ _owner: uid })
			.where({ show: true })
			.skip((page - 1) * perPage)
			.limit(perPage)
			.sort('-date')
			.select('orderNumber date products total amount express status')
			.lean()
			.exec()
    console.log(orders)
    ctx.body = {
			data: orders
		}
	}

	/**
	 * GET
	 * 查看订单详细
	 * params = { uid, orderNumber }
	 * @param ctx
	 * @param next
	 * @returns {Promise.<void>}
	 */
	static async orderDetail (ctx, next) {
		console.log('order detail');
		const { uid, orderNumber } = ctx.params
		iv(uid)
		if (!orderNumber || !/^0\d{17}$/.test(orderNumber)) throw new ApiError(ApiErrorNames.MISSING_PARAMETER_OR_PARAMETER_ERROR)
		const order = await Order
			.findOne({ orderNumber })
			.select('-__v')
			.lean()
			.exec()
		if (!order) {
			throw new ApiError(ApiErrorNames.ORDER_NOT_EXIST)
		}
		ctx.body = {
			data: order
		}
	}

	/**
	 * PUT
	 * 修改订单（状态）
	 * 伪删除订单 (改为不可见)
	 * params = { uid, orderNumber }
	 * body = { del: Boolean, status: Number }
	 * status: [0, 1, 2, 3, 4, 5, 6, 7]   // 未支付，已支付(待发货)，已发货，已完成，已取消, 申请退款， 已退款， 退款失败
	 * @param ctx
	 * @param next
	 * @returns {Promise.<void>}
	 */
	static async modifyOrder (ctx, next) {
		console.log('订单删除或者状态修改')
		const { uid, orderNumber } = ctx.params
		iv(uid)
		if (!orderNumber || !/^0\d{17}$/.test(orderNumber)) throw new ApiError(ApiErrorNames.MISSING_PARAMETER_OR_PARAMETER_ERROR)
		const { del, status } = ctx.request.body
		if (del === undefined && status === undefined) throw new ApiError(ApiErrorNames.MISSING_PARAMETER_OR_PARAMETER_ERROR)
		if (del) {
			const { n, nModified } = await Order.update({ orderNumber }, { show: false })
			if (!n) throw new ApiError(ApiErrorNames.ORDER_NOT_EXIST)
			ctx.body = {
				message: '删除成功',
				data: `发现${n}订单，删除${nModified}订单`
			}
			return
		}
		const { n, nModified } = await Order.update({ orderNumber }, { status })
		if (!n) throw new ApiError(ApiErrorNames.ORDER_NOT_EXIST)
		if (~~status === 1) {
      console.log('新的待发货订单')
			io.nsp.emit('new-order', '新的待发货订单')
    }
		ctx.body = {
			message: '更新成功',
			data: `发现${n}订单，更新${nModified}订单`
		}
	}

	/**
	 * GET
	 * 获取订单列表（sys）
	 * query = { size, page, status }
	 * @param ctx
	 * @param next
	 * @returns {Promise.<void>}
	 */
	static async getOrderList (ctx, next) {
		console.log('获取订单列表（sys）')
		const { size = 20, page = 1, status, field, q } = ctx.query
		const count = await Order.count(status ? { status } : {})
		const s = {}
		if (status !== undefined) {
			s.status = status
		}
		if (field && ['orderNumber', '_ownerPhone', '_ownerNick'].indexOf(field) >= 0 && q) {
      s[field] = {$regex: new RegExp(`^${q}`) }
    }
    console.log(s)
    const orders = await Order
			.find(s)
			.sort('-date')
			.skip((page - 1) * size)
			.limit(~~size)
			.select('-__v')
			.lean()
			.exec()
		ctx.body = {
			data: {
				orders,
				count,
				total: Math.ceil(count / size),
				current: page,
				size
			}
		}
	}

	/**
	 * 非接口
	 * 仅供socket使用
	 */
	static async toBeDelevred () {
		console.log('socket 使用，获取是否有未发货订单')
		const count = await Order.count({ status: 1 })
		return count
	}

	/**
	 * PUT
	 * 确认发货 (sys)
	 * params = { on }
	 * @param ctx
	 * @param next
	 * @returns {Promise.<void>}
	 */
	static async deliverGoods (ctx, next) {
		console.log('确认发货 (sys)')
		const { on } = ctx.params
		if (!on || !/^0\d{17}$/.test(on)) throw new ApiError(ApiErrorNames.MISSING_PARAMETER_OR_PARAMETER_ERROR)
		const order = await Order.findOne({ orderNumber: on }).exec()
		if (!order) throw new ApiError(ApiErrorNames.ORDER_NOT_EXIST)
		if (~~order.status !== 1) throw new ApiError(ApiErrorNames.UNKNOWN_ERROR)
		order.status = 2
		await order.save()
		ctx.body = {
			message: '修改成功'
		}
	}
}

module.exports = OrderController