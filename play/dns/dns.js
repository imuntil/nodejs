#!/usr/local/bin/node

const dns = require('dns')

dns.reverse('106.14.8.246', (err, domains) => {
  console.log('err:', err)
  console.log(domains)
})
