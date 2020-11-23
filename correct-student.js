const Correct = require('./correct');

let params = process.argv.splice(2);
Correct.runByStudent(params[0],params[1],params[2],params[3]);