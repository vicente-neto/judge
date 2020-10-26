const DriveJudge = require('./driveJudge');
const GoogleApi = require('../google-api');

class Pastas extends DriveJudge{
    deliberate(){
        let service = GoogleApi.getdriveactivity();
        let params = {
            "itemName":"items/"+this.firstIdDriveFile()
          };
          return service.activity.query({requestBody: params}).
            then(res=>{
                res.data.activities.forEach((activity)=>console.log(activity.actions[0].detail));
                //this.assert(res.data.activities),"documento deve ir para lixeira e depois restaurado",100)
            });
    }    
}

module.exports = Pastas;
