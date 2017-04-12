/**
 * Created by 斌 on 2017/4/6.
 */
const mongoose = require('mongoose')

const vacationSchema = mongoose.Schema({
    name: String,
    slug: String,
    category: String,
    sku: String,            //库存,产品编号
    description: String,
    priceInCents: Number,
    tags: [String],
    inSeason: Boolean,
    available: Boolean,
    requireWaiver: Boolean,
    maximumGuests: Number,
    notes: String,
    packagesSold: Number,
});

vacationSchema.methods.getDisplayPrice = function () {
    return '$' + (this.priceInCents/100).toFixed(2);
};
const Vacation = mongoose.model('Vacation', vacationSchema);

Vacation.find((err, vacations) => {
    if (vacations.length) return;
    new Vacation({
        name:'Hood River Day Trip',
        slug:`hood-river-day-trip`,
        category:`Day Trip`,
        sku:`HR199`,
        description:`Spend a day sailing on the Columbia and enjoying craft beers in Hood River!`,
        priceInCents:9995,
        tags:['day trip', `hood river`, `sailing`, `windsurfing`, `breweries`],
        inSeason:true,
        maximumGuests:16,
        available:true,
        packagesSold:0
    }).save();
    new Vacation({
        name:'Oregon Coast Getaway',
        slug:`hood-river-day-trip`,
        category:`Day Trip`,
        sku:`HR198`,
        description:`Spend a day sailing on the Columbia and enjoying craft beers in Hood River!`,
        priceInCents:9995,
        tags:['day trip', `hood river`, `sailing`, `windsurfing`, `breweries`],
        inSeason:true,
        maximumGuests:16,
        available:true,
        packagesSold:0
    }).save();
    new Vacation({
        name:'Rock Climbing in Bend',
        slug:`hood-river-day-trip`,
        category:`Day Trip`,
        sku:`HR197`,
        description:`Spend a day sailing on the Columbia and enjoying craft beers in Hood River!`,
        priceInCents:9995,
        tags:['day trip', `hood river`, `sailing`, `windsurfing`, `breweries`],
        inSeason:false,
        maximumGuests:16,
        available:true,
        packagesSold:0
    }).save();
});

module.exports = Vacation;