const GoogleApi = require('../google-api');
const Judge = require('./judge');
const fs = require("fs");

class DriveJudge extends Judge{
    static drive = GoogleApi.getdrive();
    constructor(studentSubmission){
        super(studentSubmission);
    }
    get_fields(fields){
        return DriveJudge.drive.files.get({fileId:this.firstIdDriveFile(),fields:fields})
        .then(res=>res.data)
        .catch(res=>({}));
    }

    get_permissions(role="reader"){
        return this.get_fields("permissions")
            .then((permissions)=>permissions.filter((permission)=>permission.role=="reader"))
            .catch(()=>[]);
    }

    get_comments(){
        return DriveJudge.drive.comments.list({fileId:this.firstIdDriveFile(),fields:"*"})
            .then(res=>res.data.comments)
            .catch(rej=>[]);
    }

    get_content(){
        return DriveJudge.drive.files.get({fileId:this.firstIdDriveFile(),alt:"media"}).then((res)=>res.data);
    }  

    
}

module.exports = DriveJudge;
