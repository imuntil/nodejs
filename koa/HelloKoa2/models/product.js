const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const productSchema = new mongoose.Schema({
	sku: { type: String, required: 'sku是必须字段', unique: 'sku必须唯一' },
	en: { type: String, required: '产品英文名是必须字段' },
	cn: { type: String, required: '产品中文名是必须字段' },
	images: [String],
	price: { type: Number, min: 0, required: '产品价格是必须字段' }, //原价
	truePrice: { type: Number, min: 0, required: '真实售价是必须字段' }, //真实售价
	setToSales: {
		type: Number,
		enum: [0, 1, 2],
		default: 0
	}, // 设为打折商品，只有在字段不为0，discounted和off才会可用. 1代表discounted,2代表off
	discounted: {
		type: Number,
		default: 0,
		validate: {
			validator (v) {
				return v >= 0
			},
			message: '优惠价不得低于0'
		}
	},   // 优惠价
  off: {
    type: Number,
    default: 0.01,
    validate: {
      validator (v) {
        return v >= 0.01 && v <= 0.99
      },
      message: '折扣额度须在0.01~0.99之间'
    }
	},  // 折扣
	alcoholic: { type: Number, default: 0, min: 0, max: 100 },
	stock: { type: Number, default: 0, min: 0, max: 99999 },	// 库存
	sales: { type: Number, default: 0, min: 0, max: 999999 },	// 销售量
	cart: { type: Number, default: 0, min: 0, max: 999999 }, // 被加入购物车
	like: { type: Number, default: 0, min: 0, max: 999999 }, // 被收藏
	content: { type: Number, default: 1000, min: 1, max: 10000 }, // 净含量
	weight: { type: Number, default: 1000, min: 1, max: 99999 }, // 净重
	origin: { type: String, required: '产地是必须字段', default: '' }, // 产地
	_type: { type: Number, required: '产品类别是必须字段', enum: [1, 2, 3, 4, 5, 6, 7, 8, 9] }, // 类别，
	recommend: { type: Boolean, default: false }, // 推荐产品（首页topbar展示）
	hot: { type: Boolean, default: false }, // 热销，和销量无关。为手动设置的热销产品。在首页展示
	fs: { type: Boolean, default: false }, // free shipping 免邮
	coupon: {
		type: String,
	},
	introduce: {
		type: String,
		validate: {
			validator (v) {
				return v.length <= 100000
			},
			message: '内容过长'
		}
	}, // 产品介绍
	date: { type: Date, default: Date.now() }, // 添加日期
	update: { type: Date, default: Date.now() } // 最后更新日期
})

productSchema.plugin(uniqueValidator)
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