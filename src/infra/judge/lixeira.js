const Judge = require('./judge');
const GoogleApi = require('../google-api');

class Lixeira extends Judge{
    deliberate(){
        let service = GoogleApi.getdriveactivity();
        let params = {
            "itemName":"items/"+this.firstIdDriveFile()
          };
          return service.activity.query({requestBody: params}).
            then(res=>{
                //console.log(res.data.activities);
                this.assert(res.data.activities.some((activity)=>activity.primaryActionDetail.hasOwnProperty("restore")),"documento deve ir para lixeira e depois restaurado",100)
            });
    }    
}

module.exports = Lixeira;