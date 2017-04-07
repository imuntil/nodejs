/**
 * Created by 斌 on 2017/4/6.
 */
const mongoose = require('mongoose');

const newsletterSignedSchema = new mongoose.Schema({
    name:String,
    email:String
});

const NewsletterSignedListener = mongoose
    .model('NewsletterSignedLister', newsletterSignedSchema);

module.exports = NewsletterSignedListener;