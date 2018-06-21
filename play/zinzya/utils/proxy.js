const superagent = require('superagent')
require('superagent-proxy')(superagent)

superagent
  .get('https://www.google.com')
  .proxy('http://221.237.122.22:8118')
  .end((err, res) => {
    if (err) {
      console.log(err)
      return
    }
    console.log(res.text)
  })