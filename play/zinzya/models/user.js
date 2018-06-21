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
    type: String
  },
  nick: String,
  token: String,
  auth: {
    type: Number,
    /* 默认1，全部功能，其他后续可能开放, 管理员4，可以添加账号 */
    enum: [
      1, 2, 3, 4
    ],
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