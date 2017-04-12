/**
 * Created by 斌 on 2017/4/11.
 */
const Vacation = require('../models/vacation');
const _ = require('lodash');


function convertFormUSD(value, currency) {
    switch (currency) {
        case 'USD': return value * 1;
        case 'GBP': return value * 0.6;
        case 'BTC': return value * 0.0023707918444761;
        default: return NaN;
    }
}

function getAllVacationsViewModel(currency) {
    return Vacation.find({available: true})
        .then(docs => {
            let vacations =  docs.map(doc => {
                return {
                    sku: doc.sku,
                    name: doc.name,
                    description: doc.description,
                    price: convertFormUSD(doc.priceInCents/100, currency),
                    inSeason: doc.inSeason,
                }
            });
            let context = {};
            context.vacations = vacations;
            context.currency = currency;
            switch (currency) {
                case 'USD':context.currencyUSD = 'selected'; break;
                case 'GBP':context.currencyGBP = 'selected'; break;
                case 'BTC':context.currencyBTC = 'selected'; break;
            }
            return context;
        })
        .catch(err => err)
}

function getVacationViewModel(query, currency) {
    return Vacation.findOne(query)
        .then(doc => {
            return {
                sku: doc.sku,
                name: doc.name,
                description: doc.description,
                price: convertFormUSD(doc.priceInCents/100, currency),
                inSeason: doc.inSeason,
                maximumGuests: doc.maximumGuests,
            }
        })
        .catch(err => err)
}

module.exports = {
    getAllVacationsViewModel,
    getVacationViewModel
};