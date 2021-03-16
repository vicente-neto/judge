var cron = require('node-cron'); 

class Application{
    constructor(){
        this._routers = new Map();
    }
    add(router,controller){
        this._routers.set(router,controller);
    }
    run(params={}){
        console.log("running application...");
    }
    listen(){
        cron.schedule('* * * * *', () => {  this.run(); });
    }

}

module.exports = Application;