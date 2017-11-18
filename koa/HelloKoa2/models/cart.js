const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Product = require('./product')

const cProSchema = Schema({
	sku: { type: String, required: true },
	count: { type: Number, required: true },
	chosen: { type: Boolean }
})
const cartSchema = Schema({
	_owner: { type: Schema.Types.ObjectId, ref: 'User' },
	date: Date,
	products: [cProSchema]
})

cartSchema.methods.getCart = function () {
	const pros = this.products
	if (!pros.length) {
		return Promise.resolve([])
	}
	return Product
		.find()
		.where('sku')
		.in(pros.products.map(p => p.sku))
		.exec()
}

module.exports = mongoose.model('Cart', cartSchema)