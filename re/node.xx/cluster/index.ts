import cluster from 'cluster'
import os from 'os'

const createWorker = () => {
  const worker = cluster.fork()
  let itv: any
  let missed = 0
  // 心跳监测：定时发送ping
  itv = setInterval(() => {
    worker.send('ping')
    console.log(`missed`, missed)
    // 连续3次无响应，退出进程
    if (missed >= 3) {
      process.kill(worker.process.pid)
    }
    missed++
  }, 3000)

  // 心跳监测：收到pong，重置记录
  worker.on('message', (msg: string) => {
    console.log(msg)
    msg === 'pong' && (missed = 0)
  })

  // 监测到当前进程退出，删除心跳监测
  worker.on('exit', () => {
    clearInterval(itv)
  })
}

if (cluster.isMaster) {
  const cpus = os.cpus().length >> 2 || 1
  for (let i = 0; i < cpus; i++) {
    createWorker()
  }

  // 监听到进程退出，重新开启一个进程
  cluster.on('exit', () => {
    setTimeout(() => {
      // 为了防止进入死循环，做个延时处理
      createWorker()
    }, 5e3)
  })
} else {
  import('./app')

  // 监听未捕获错误
  process.on('uncaughtException', (err) => {
    console.error('err:', err)
    // 退出进程
    process.exit(1)
  })

  // 内存检测
  setInterval(() => {
    // 进程占用内存超过某个值，退出该进程
    if (process.memoryUsage().rss > 1024 * 1024 * 700) {
      console.log('xxxxxxx over memory')
      process.exit(1)
    }
  }, 5e3)

  // 心跳监测：收到主进程的ping，回复pong
  process.on('message', (msg: string) => {
    console.log(msg)
    msg === 'ping' && process.send('pong')
  })

  // 心跳监测：模拟进程假死（还在执行，但是已经不能响应任何消息）
  setTimeout(() => {
    while (true) {}
  }, 5e3)
}
