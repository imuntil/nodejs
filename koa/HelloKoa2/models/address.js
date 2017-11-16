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

const Address = mongoose.model('Address', addressSchema)
module.exports = Address