const cycle = new Array(3600).fill([])
const Order = require('../models/order')
let currentIndex = 0
setInterval(function () {
  run()
  if (currentIndex === 3599) {
    currentIndex = 0
  } else {
    currentIndex ++
  }
}, 1000)

function run () {
  const tasks = cycle[currentIndex]
  if (!tasks.length) return false
  tasks.forEach((t, i) => {
    if (t.cycleNum > 0) t.cycleNum -= 1
    else set2Cancel(tasks, i)
  })
}

function set2Cancel (tasks, i) {
  const { orderNumber } = tasks[i]
  Order.findOne({ orderNumber }).exec()
    .then(doc => {
      if (doc.status === 0) {
        doc.status = 4
        tasks.splice(i, 1)
        console.log(`取消orderNumber为${orderNumber}的订单`)
      }
    })
    .catch(err => {
      console.log(err);
    })
}

function addToCycle (task) {
  cycle[currentIndex].push(task)
}

module.exports = cycle
