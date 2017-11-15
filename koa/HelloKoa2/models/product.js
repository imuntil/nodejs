const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
	sku: { type: String, required: true },
	en: { type: String, required: true },
	cn: { type: String, required: true },
	images: [String],
	price: { type: Number, min: 0, required: true },
	discounted: { type: Number, min: 0 },
	alcoholic: Number,
	stock: Number,	// 库存
	sales: Number,	// 销售量
	content: Number, // 净含量
	weight: Number, // 净重
	origin: String, // 产地
	_type: Number, // 类别
	introduce: String, // 产品介绍
	date: Date, // 添加日期
	update: Date // 最后更新日期
})

productSchema.pre('save', next => {

})