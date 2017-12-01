const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')
const Schema = mongoose.Schema

const adminSchema = new Schema({
  account: { type: String, required: true },
  password: { type: String, required: true },
  token: { type: String, required: true }
})

adminSchema.methods.encryptPassword = password =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(5), null)
adminSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password)
}
adminSchema.statics.encryptPassword = password =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(5), null)

const Admin = mongoose.model('admin', adminSchema)
module.exports = Admin
