const timer = 10
const cycle = new Array(timer)
const Order = require('../models/order')
const Product = require('../models/product')
const _ = require('lodash')
let currentIndex = 0
setInterval(function () {
  run()
  if (currentIndex === timer - 1) {
    currentIndex = 0
  } else {
    currentIndex ++
  }
}, 1000)

function run () {
	const tasks = cycle[currentIndex]
  if (!tasks || !tasks.length) return false
  tasks.forEach((t, i) => {
    if (t.cycleNum > 0) t.cycleNum -= 1
    else {
      Promise.all([
        set2Cancel(tasks[i]),
        backDepot(tasks[i])
      ]).then(res => {
        tasks.splice(i, 1)
      }).catch(e => {
        console.log(e)
        tasks.splice(i, 1)
      })
    }
  })
}

// 当服务器因为某些原因重启，则需要将数据库中的status => 0的订单加入队列
async function init() {
  const orders = await Order.find({ status: 0 }).lean().exec()
  if (!orders || !orders.length) return true
  // 当前时间
  const now = new Date()
  // 已经过期的订单（需要立刻取消）
  const exipredOrders = []
  orders.forEach(o => {
    const { orderNumber, date, products } = o
    const body = products.map(p => ({ sku: p.sku, count: p.count }))
    const timeDif = now - date
    // 时间差，如果下单时间与当前时间的差值超过timer，则订单过期。
    if (timeDif >= timer * 1000) {
      exipredOrders.push({ orderNumber, body, cycleNum: 0 })
    } else {
      const index  = Math.floor(timeDif / 1000)
      if (!cycle[index]) cycle[index] = []
      cycle[index].push({ orderNumber, body, cycleNum: 0 })
    }
  })
  // 如果有过期的订单
  if (exipredOrders.length) {
    // 以防过期订单过多，将之分块。push到cycle中
    const chunkExpiredOrders = _.chunk(exipredOrders, 5)
    chunkExpiredOrders.forEach((chunk, i) => {
      // 从当前指针的下一个开始
      cycle[currentIndex + i + 1] = [...chunk]
    })
  }
}

// 自动取消订单
async function set2Cancel (task) {
  const { orderNumber } = task
  const order = await Order.findOne({ orderNumber }).exec()
	if (order && order.status === 0) {
    order.status = 4
    await order.save()
		console.log(`取消orderNumber为${orderNumber}的订单`)
  }
}
// 将取消订单的商品返库
async function backDepot (task) {
  const { body } = task
  const promises = body.map(async ({ sku, count }) => {
    try {
      const p = await Product.findOne({ sku }).exec()
      if (p) {
        p.stock += count
        await p.save()
      }
    } catch (e) {
      console.log(e);
    }
    return true
  })
  await Promise.all(promises)
  console.log('已返库完成')
}

function addToCycle (task) {
  const nextCycleIndex = currentIndex === 0 ? timer - 1 : currentIndex - 1
  if (!cycle[nextCycleIndex]) cycle[nextCycleIndex] = []
  cycle[nextCycleIndex].push({ ...task, cycleNum: 0 })
}

setTimeout(function () {
  init().then(() => {}).catch(e => {
    console.log('xxx')
    console.log(e)
  })
}, 1000)

module.exports = addToCycle
