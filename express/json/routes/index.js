var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  // var json = {
  //     "name":"express-json",
  //     "date":"17.3.9",
  //     "version":"0.0.1",
  //     "new":"true"
  // };
  // // res.send(json);
  //   res.json(json);
  //   res.end();
});

module.exports = router;
