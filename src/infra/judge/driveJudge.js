const GoogleApi = require('../google-api');
const Judge = require('./judge');
const fs = require("fs");

class DriveJudge extends Judge{
    static drive = GoogleApi.getdrive();

    get_fields(fields){
        return DriveJudge.drive.files.get({fileId:this.firstIdDriveFile(),fields:fields})
        .then(res=>res.data)
        .catch(res=>({}));
    }

    get_permissions(role="reader"){
        return this.get_fields("permissions").then((fields)=>fields.permissions.filter((permission)=>permission.role==role)).catch((rej)=>[]);
    }

    get_comments(){
        return DriveJudge.drive.comments.list({fileId:this.firstIdDriveFile(),fields:"*"})
            .then(res=>{return res.data.comments})
            .catch(rej=>[]);
    }

    get_content(){
       // DriveJudge.drive.files.get({fileId:this.firstIdDriveFile(),alt:"media"}).then((res)=>console.log(res.data));
        return DriveJudge.drive.files.get({fileId:this.firstIdDriveFile(),alt:"media"}).then((res)=>res.data);
    }  

    get_revisions(){
        return DriveJudge.drive.revisions.list({fileId:this.firstIdDriveFile()});
    }

    
}

module.exports = DriveJudge;
