/**
 * Created by 斌 on 2017/4/6.
 */
const mongoose = require('mongoose');

const attractionSchema = mongoose.Schema({
    name: String,
    description: String,
    location: {lat: Number, lng: Number},
    history: {
        event: String,
        notes: String,
        email: String,
        data: Date,
    },
    updateId: String,
    approved: Boolean,
});

const Attraction = mongoose.model('Attraction', attractionSchema);
module.exports = Attraction;