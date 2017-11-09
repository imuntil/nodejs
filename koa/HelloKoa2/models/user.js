const mongoose = require('mongoose')
const Scheme = mongoose.Schema

const userSchema = new Scheme({
	phone: {
		type: String,
		required: true,
		unique: true
	},
	created: Date,
	password: String,
	nick: String,
	avatar: String,
	openID: String,
	token: String
})

module.exports = mongoose.model('User', userSchema)