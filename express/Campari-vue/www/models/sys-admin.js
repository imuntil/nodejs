/**
 * Created by 斌 on 2017/4/24.
 */
const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')

const adminSchema = mongoose.Schema({
  amount: String,
  created: Date,
  password: String,
  permission: Number
})

adminSchema.methods.encryptPassword = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
}
adminSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password)
}

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;