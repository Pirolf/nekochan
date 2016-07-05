const recluster = require('recluster');
const path = require('path');
console.log('server path: ',path.join(__dirname, './server', 'app.js'))
const cluster = recluster('./server/app.js');
cluster.run();

process.on('SIGUSR2', function() {
    console.log('Got SIGUSR2, reloading cluster...');
    cluster.reload();
});

console.log("spawned cluster, kill -s SIGUSR2", process.pid, "to reload");
