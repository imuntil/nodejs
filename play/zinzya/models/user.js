const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')
const pm = require('../utils/permission')

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true
  },
  created: {
    type: Date,
    default: Date.now()
  },
  password: {
    type: String
  },
  nick: {
    type: String,
    required: true
  },
  avatar: String,
  token: String,
  auth: {
    type: Number,
    enum: Object.values(pm),
    default: 1
  }
})

userSchema.methods.encryptPassword = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
userSchema.statics.encryptPassword = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
userSchema.methods.validPassword = async function (password) {
  try {
    const value = await bcrypt.compareSync(password, this.password)
    return value
  } catch (e) {
    return false
  }
}

module.exports = mongoose.model('User', userSchema)