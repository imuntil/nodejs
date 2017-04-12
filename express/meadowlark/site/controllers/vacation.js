/**
 * Created by 斌 on 2017/4/11.
 */
const Vacation = require('../models/vacation');
const viewModel = require('../viewModels/vacation');


module.exports = {
    registerRouter(app) {
        app.get('/vacation/all', this.all);
        app.get('/vacation/join', this.join);
    },

    all(req, res, next) {
         viewModel.getAllVacationsViewModel(req.session.currency)
             .then(docs => {
                 res.render('vacation/all', docs);
             })
             .catch(err => next(err));
    },
    join(req, res, next) {
        viewModel.getVacationViewModel(req.query, req.session.currency)
            .then(vacation => {
                res.render('vacation/join', vacation);
            })
            .catch(err => next(err));
    }
};