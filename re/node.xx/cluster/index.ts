import cluster from 'cluster'
import os from 'os'

if (cluster.isMaster) {
  const cpus = os.cpus().length >> 1
  for (let i = 0; i < cpus; i++) {
    cluster.fork()
  }
} else {
  import('./app')
}
