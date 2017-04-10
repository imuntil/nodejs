/**
 * Created by 斌 on 2017/4/8.
 */
const mongoose  = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Orders = require('./orders')
const userSchema = mongoose.Schema({
    email: String,
    role: String,
    created: Date,
    password: String,
    firstName: String,
    lastName: String,
    phone: String,
    nick:String,
    address: String,
    avatar:String,
});

userSchema.methods.encryptPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.methods.getOrders = function () {
    return Orders.findOne({customID: this._id});
};

const User = mongoose.model('User', userSchema);
module.exports = User;