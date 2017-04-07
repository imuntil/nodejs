/**
 * Created by 斌 on 2017/4/6.
 */
const router = require('express').Router();
const Vacation = require('../models/vacation');

function convertFormUSD(value, currency) {
    switch (currency) {
        case 'USD': return value * 1;
        case 'GBP': return value * 0.6;
        case 'BTC': return value * 0.0023707918444761;
        default: return NaN;
    }
}

router.get('/', (req, res) => {
    Vacation.find({available: true}, (err, vacations) => {
        let currency = req.session.currency || 'USD';
        const context = {
            currency: currency,
            vacations : vacations.map(vacation => {
                return {
                    sku: vacation.sku,
                    name: vacation.name,
                    description: vacation.description,
                    price: convertFormUSD(vacation.priceInCents/100, currency),
                    inSeason: vacation.inSeason
                }
            })
        };

        switch (currency) {
            case 'USD':context.currencyUSD = 'selected'; break;
            case 'GBP':context.currencyGBP = 'selected'; break;
            case 'BTC':context.currencyBTC = 'selected'; break;
        }
        res.render('vacations', context);
    });
});

module.exports = router;