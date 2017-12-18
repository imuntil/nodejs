const timer = 3600
const cycle = new Array(timer)
const Order = require('../models/order')
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
    else set2Cancel(tasks, i)
  })
}

async function set2Cancel (tasks, i) {
  const { orderNumber } = tasks[i]
  const order = await Order.findOne({ orderNumber }).exec()
	if (order && order.status === 0) {
    order.status = 4
    await order.save()
		console.log(`取消orderNumber为${orderNumber}的订单`)
  }
  tasks.splice(i, 1)
}

function addToCycle (task) {
  if (!cycle[currentIndex]) cycle[currentIndex] = []
  cycle[currentIndex].push({ ...task, cycleNum: 1 })
}

module.exports = addToCycle
