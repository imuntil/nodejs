const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema = new Schema({
	_owner: Schema.Types.ObjectId,	//用户id
	orderNumber: String,	// 订单号
	date: Date,  // 订单日期
	products: [{
		sku: String,  // 商品sku
		en: String,  // 商品名
		cn: String,
		count: Number, // 购买商品数量
		price: Number, // 商品单价
		content: Number,  // 净含量
		image: String  // 商品图
	}],
	total: Number,  // 订单总商品数量
	amount: Number,  // 订单金额,
	express: Number,  // 快递费用,
	status: {		// 订单状态
		type: Number,
		enum: [0, 1, 2, 3]   // 未支付，已支付，已完成，已取消
	},
	address: {  // 地址信息
		province: String,
		city: String,
		detail: String,
		phone: String,
		name: String
	},
	show: Boolean  // 是否可见（默认可见，用户删除订单后不可见）
})

module.exports = mongoose.model('Order', orderSchema)