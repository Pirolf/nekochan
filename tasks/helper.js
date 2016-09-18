const fs = require('fs');
const path = require('path');
const {spawn} = require('child_process');

const pidfile = '/Users/pirolf/Projects/nekochan/pids/mongod-test.pid';

const startMongo = (cb) => {
  const tmpPath = fs.mkdtempSync(`/tmp${path.sep}`);
  const dataPath = `${tmpPath}/mongod`;
  const logsPath = `${tmpPath}/logs`;

  fs.mkdirSync(dataPath);
  fs.mkdirSync(logsPath);
  console.log(`creating test db: ${tmpPath}`);

  const mongod = spawn('mongod', [
    `--dbpath=${dataPath}`,
    '--port=28017',
    `--pidfilepath=${pidfile}`,
    '--fork',
    `--logpath=${logsPath}/mongod-test.log`
  ]);

  mongod.stdout.on('data', (stdout) => {
    console.log(`stdout: ${stdout}`);
  });
  mongod.stderr.on('data', (stderr) => {
    console.log(`stderr: ${stderr}`);
  });

  mongod.on('close', cb);
};

const killMongo = () => {
  const pid = fs.readFileSync(pidfile);
  process.kill(pid);
};

module.exports = {
  startMongo,
  killMongo
};
