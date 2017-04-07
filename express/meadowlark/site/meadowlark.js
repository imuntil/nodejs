/**
 * Created by 斌 on 2017/4/3.
 */
const express = require('express')
const weather = require('./lib/weather-data')
const credentials = require('./credentials')
const mailTransport = require('./lib/email')(credentials)
const http = require('http');
const cluster = require('cluster');
const mongoose = require('mongoose');
const expressSession = require('express-session');
const RedisStore = require('connect-redis')(expressSession);
const vHost = require('vhost');
const fs = require('fs');

//route
const notifyMeWhenInSeasonRouter = require('./route/notify-me-when-in-season')
const home = require('./route/home')
const about = require('./route/about')
const headers = require('./route/headers')
const newsletter = require('./route/newsletter')
const tours = require('./route/tours')
const vacationPhoto = require('./route/vacation-photo')
const cartThankYou = require('./route/cart-thank-you')
const vacations = require('./route/vacations');

const app = express();

//替换mongoose的promise
mongoose.Promise = global.Promise;
let server;

const handlebars = require('express3-handlebars')
    .create({
        defaultLayout:'main',
        helpers: {
            section(name, options) {
                if (!this._sections) this._sections = {};
                this._sections[name] = options.fn(this);
                return null;
            }
        }
    });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));
app.use(require(`body-parser`)());
app.use(require(`cookie-parser`)(credentials.cookieSecret));
//使用会话
app.use(expressSession({
    store: new RedisStore({
        host:'localhost',
        port:'6379'
    }),
    secret: credentials.cookieSecret
}));

app.use((req, res, next) => {
    if (cluster.isWorker) console.log(`Worker ${cluster.worker.id} received request`);
    next();
});

//创建中间件，添加天气数据
app.use((req, res, next) => {
    if (!res.locals.partials) res.locals.partials = {};
    res.locals.partials.weather = weather.getWeatherData();
    next();
});

//即显消息中间件
app.use((req, res, next) => {
    res.locals.flash = req.session.flash;
    delete req.session.flash;
    next();
})

//test router
app.use((req, res, next) => {
    res.locals.showTests = app.get('env') !== 'production' &&
            req.query.test === '1';
    next();
})

app.use('/', home);
app.use('/about', about);
app.use('/notify-me-when-in-season', notifyMeWhenInSeasonRouter);
app.use('/headers', headers);
app.use('/newsletter', newsletter);
app.use('/tours', tours);
app.use('/contest', vacationPhoto);
app.use('/cart-thank-you', cartThankYou);
app.use('/vacations', vacations);

// app.use('/set-currency/', api);


app.get(`/jquery-test`, (req, res) => {
    res.render('jquery-test');
})


app.post(`cart/checkout`, (req, res, next) => {
    const cart = req.session.cart;
    if (!cart) next(new Error('Cart does not exist.'))
    let name = req.body.name || '',
        email = req.body.email || '';
    if (!email.match(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/)) {
        return res.next(new Error('Invalid eamil address.'))
    }
    cart.number = Math.random().toString().replace(/^0\.0*/, '')
    cart.billing = {
        name:name,
        email:email
    };

    res.render('email/cart-thank-you', {
        layout: null,
        cart: cart
    }, (err, html) => {
        if (err) console.log('error in email template');
        mailTransport.send('imuntil@qq.com', 'hi', html)
    })
    res.render('cart-thank-you', {cart:cart})
})


app.get('/fail', (req, res) => {
    throw new Error('Nope!');
})

app.get('/epic-fail', (req, res) => {
    process.nextTick(() => {
        throw new Error('Kaboom!')
    })
})


//API
app.use('/api', require('./api/app-api'));

let autoViews = {};
app.use((req, res, next) => {
    let path = req.path.toLowerCase();
    if (autoViews[path]) return res.render(autoViews[path]);
    if (fs.existsSync(`${__dirname}/views${path}.handlebars`)) {
        autoViews[path] = path.replace(/^\//, '');
        return res.render(autoViews[path]);
    }
    next();
})

// app.use(vHost('api.localhost', require('./api/api-app')));


app.use((req, res, next) => {
    res.status(404);
    res.render('404')
});
//错误处理
//logErrors
app.use((err, req, res, next) => {
    // mailTransport.send('imuntil@qq.com', 'error happen', err.stack)
    console.error(err.stack);
    next(err);
});
//clientErrorHandler
app.use((err, req, res, next) => {
    if (req.xhr) {
        res.status(500).send({error:'Something blew up!'})
    } else {
        next(err);
    }
});
//errorHandler
app.use((err, req, res, next) => {
    res.status(500);
    res.render('error', {error: err})
});

//连接vacations数据库
mongoose.connect('mongodb://localhost:27017/meadowlark_vacations', function (error) {
    if (!error) {
        console.log('connected to mongodb');
    } else {
        throw error;
    }
});

function startServer() {
    server = http.createServer(app).listen(app.get('port'), () => {
        console.log(`Express started in ${app.get('env')} mode on 
        http://localhost: ${app.get('port')}; press Ctrl-C to terminate.`);
    })
}

if (require.main === module) {
    startServer();
} else {
    module.exports = startServer;
}