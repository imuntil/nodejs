/**
 * Created by 斌 on 2017/4/13.
 */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = mongoose.Schema({
    phone: String,
    created: Date,
    password: String,
    nick: String,
    avatar: String,
    opendId: String,
});

userSchema.methods.encryptPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};
userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};



const User = mongoose.model('User', userSchema);
module.exports = User;