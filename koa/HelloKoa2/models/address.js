const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema({
	_owner: { type: String, require: true },
	province: { require: true, type: String },
	city: { require: true, type: String },
	detail: { require: true, type: String },
	name: { require: true, type: String },
	phone: { require: true, type: String },
	label: String,
	isDefault: Boolean,
	date: Date
})

addressSchema.pre('save', (next, a, b, c) => {
	// console.log(typeof a);
	// console.log(b());
	next()
})
const Address = mongoose.model('Address', addressSchema)
module.exports = Address