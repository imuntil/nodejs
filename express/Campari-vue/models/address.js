/**
 * Created by 斌 on 2017/4/13.
 */
const mongoose = require('mongoose');

const addressSchema = mongoose.Schema({
    _owner: String,
    province: String,
    city: String,
    detail: String,
    name: String,
    phone: String,
    isDefault: Boolean,
    date: Date,
});

const Address = mongoose.model('Address', addressSchema);
module.exports = Address;