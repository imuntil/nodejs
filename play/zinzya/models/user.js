const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')

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
    type: String,
    required: true,
    select: false
  },
  nick: String,
  token: String,
  auth: {
    type: Number,
    /* 默认1，全部功能，其他后续可能开放 */
    enum: [1, 2, 3, 4],
    default: 1
  }
})

userSchema.methods.encryptPassword = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
userSchema.statics.encryptPassword = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
userSchema.methods.validPassword = password => bcrypt.compareSync(password, this.password)

module.exports = mongoose.model('User', userSchema)