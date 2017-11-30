const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')
const Scheme = mongoose.Schema

const userSchema = new Scheme({
	phone: {
		type: String,
		required: true,
		unique: true
	},
	created: { type: Date, required: true },
	password: { type: String, required: true },
	nick: { type: String, required: true },
	avatar: { type: String },
	openID: { type: String },
	token: { type: String },
	cart: { type: Scheme.Types.ObjectId, ref: 'Cart' }
})

userSchema.methods.encryptPassword = password =>
	bcrypt.hashSync(password, bcrypt.genSaltSync(5), null)
userSchema.methods.validPassword = function (password) {
	return bcrypt.compareSync(password, this.password)
}

userSchema.statics.encryptPassword = password =>
	bcrypt.hashSync(password, bcrypt.genSaltSync(5), null)

module.exports = mongoose.model('User', userSchema)