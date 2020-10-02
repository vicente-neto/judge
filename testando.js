let cmd = `python infinity.py`;
try {
    const exec = require('child_process').execSync;
    let out = exec(cmd,{timeout: 1000,killSignal: 'SIGKILL'}).toString();
} catch (error) {
    console.log(error.message);
}