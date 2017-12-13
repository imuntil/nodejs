const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')
const Product = require('./product')
const Scheme = mongoose.Schema

const userSchema = new Scheme({
	phone: {
		type: String,
		required: true,
		unique: true
	},
	created: { type: Date, required: true, default: Date.now() },
	password: { type: String, required: true },
	nick: { type: String, required: true },
	avatar: { type: String },
	openID: { type: String },
	token: { type: String },
	cart: { type: Scheme.Types.ObjectId, ref: 'Cart' },
	lastLogin: { type: Date, required: true, default: Date.now()},
	likes: [String]
})

userSchema.methods.getLikes = async function () {
	const likes = this.likes
	if (!likes.length) {
		return Promise.resolve([])
	}
	const ps = await Product
		.find()
		.where('sku')
		.in(likes)
		.select('_id sku en cn truePrice price _type discount off images')
		.lean()
		.exec()
	return ps
}

userSchema.methods.encryptPassword = password =>
	bcrypt.hashSync(password, bcrypt.genSaltSync(5), null)
userSchema.methods.validPassword = function (password) {
	return bcrypt.compareSync(password, this.password)
}

userSchema.statics.encryptPassword = password =>
	bcrypt.hashSync(password, bcrypt.genSaltSync(5), null)

module.exports = mongoose.model('User', userSchema)