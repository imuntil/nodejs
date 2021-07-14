import dns from 'dns'

dns.lookup('www.qq.com', { all: true }, (err, address, family) => {
  if (err) {
    console.log(err)
    return
  }
  console.log(`address, family`, address, family)
})

// address, family [
//   { address: '101.91.22.57', family: 4 },
//   { address: '101.91.42.232', family: 4 },
//   { address: '2402:4e00:1430:1301:0:9227:79cc:76f2', family: 6 },
//   { address: '2402:4e00:1430:1301:0:9227:79d3:ffd1', family: 6 }
// ] undefined

dns.resolve4('www.163.com', (err, address) => {
  if (err) {
    console.log(`err`, err)
    return
  }
  console.log(`address`, address)
})

// address [
//   '49.79.237.56',
//   '49.79.237.57',
//   '106.225.244.222',
//   '106.225.244.221',
//   '49.79.237.55'
// ]

/**
 * lookup, resolve4/6 都可以查询dns，区别是当本地配置host后。resolve4/6不受影响，而lookup则会被影响
 */
