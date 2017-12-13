const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Product = require('./product')
const _ = require('lodash')

const cProSchema = Schema({
	sku: { type: String, required: true },
	count: { type: Number, required: true },
	chosen: { type: Boolean },
	addDate: Date
})
const cartSchema = Schema({
	_owner: { type: Schema.Types.ObjectId, ref: 'User' },
	date: Date,
	products: [cProSchema]
})

cartSchema.methods.getCart = async function () {
	const pros = this.products
	if (!pros.length) {
		return Promise.resolve([])
	}
	// 获取产品信息
	const ps = await Product
		.find()
		.where('sku')
		.in(pros.map(p => p.sku))
		.select('_id sku en cn truePrice price _type discount images off')
		.lean()
		.exec()
	// 合并产品信息和购物车信息（数量和chosen等）
	return pros.map(p => {
		const { chosen, count, _id: cid, sku } = p
		const index = _.findIndex(ps, { sku })
		const t = { ...ps[index] }
		t.pid = t._id
		delete t._id
		ps.splice(index, 1)
		return { ...t, chosen, count, cid }
	})
}

module.exports = mongoose.model('Cart', cartSchema)