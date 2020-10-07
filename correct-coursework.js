const Correct = require('./correct');

let params = process.argv.splice(2);
Correct.runCourseWork(params[0],params[1]);