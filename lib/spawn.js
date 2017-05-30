'use strict';

const spawnPromise = (spawnProcess, input) => new Promise((resolve, reject) => {
  const stdout = [];
  const stderr = [];

  if (input) {
    spawnProcess.stdin.end(input);
  }

  spawnProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
    stdout.push(data);
  });

  spawnProcess.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
    stderr.push(data);
  });

  spawnProcess.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    if (code === 0) {
      return resolve({
        stdout: stdout.join(''),
        stderr: stderr.join(''),
      });
    }
    return reject(code);
  });
});

module.exports = {
  spawnPromise,
};
