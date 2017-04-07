/**
 * Created by 斌 on 2017/4/5.
 */
const cluster = require('cluster');

function startWorker() {
    const worker = cluster.fork();
    console.log(`CLUSTER: worker ${worker.id} started`);
}

if (cluster.isMaster) {
    require(`os`).cpus().forEach(() => {
        startWorker();
    })

    cluster.on(`disconnect`, worker => {
        console.log(`CLUSTER: Worker ${worker.id} disconnected from the cluster.`);
    })

    cluster.on(`exit`, (worker, code, signal) => {
        console.log(`CLUSTER: Worker ${worker.id} died width exit code ${code} (${signal})`);
    })
} else {
    require(`./meadowlark`)();
}