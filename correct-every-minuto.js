var cron = require('node-cron'); 
const Correct = require('./correct');  

cron.schedule('* * * * *', () => { 
    Correct.run();
});