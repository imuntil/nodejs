const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
	sku: { type: String, required: true, unique: true },
	en: { type: String, required: true },
	cn: { type: String, required: true },
	images: [String],
	price: { type: Number, min: 0, required: true }, //原价
	truePrice: { type: Number, min: 0, required: true }, //真实售价
	setToSales: {
		type: Number,
		enum: [0, 1, 2],
		default: 0
	}, // 设为打折商品，只有在字段不为0，discounted和off才会可用. 1代表discounted,2代表off
	discounted: { type: Number, min: 0, default: 0 },   // 优惠价
	off: { type: Number, min: 0.01, max: 0.99, default: 0.01 },  // 折扣
	alcoholic: { type: Number, default: 0 },
	stock: { type: Number, default: 0 },	// 库存
	sales: { type: Number, default: 0 },	// 销售量
	cart: { type: Number, default: 0 }, // 被加入购物车
	like: { type: Number, default: 0 }, // 被收藏
	content: { type: Number, default: 1000 }, // 净含量
	weight: { type: Number, default: 1000 }, // 净重
	origin: { type: String, default: '' }, // 产地
	_type: { type: Number, required: true }, // 类别
	introduce: String, // 产品介绍
	date: { type: Date, default: Date.now() }, // 添加日期
	update: { type: Date, default: Date.now() } // 最后更新日期
})

productSchema.pre('validate', function (next) {
	const { setToSales, discounted, off, price } = this
	if (!setToSales) {
		this.truePrice = price
		this.off = 0.01
		this.discounted = price
	} else if (~~setToSales === 1) {
		this.truePrice = discounted
		this.off = 0.01
	} else if (~~setToSales === 2) {
		this.truePrice = (price * (1 - off)).toFixed(2)
		this.discounted = price
	} else {
		this.setToSales = false
	}
	next()
})
productSchema.pre('save', function (next) {
	const { price, discounted, truePrice } = this
	if (discounted > price || truePrice > price) throw new Error('优惠价格不能高于原价')
	next()
})

module.exports = mongoose.model('Product', productSchema)