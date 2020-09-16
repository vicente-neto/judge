const GoogleApi = require('../google-api');
const Judge = require('./judge');

class DriveJudge extends Judge{
    static drive = GoogleApi.getdrive();
    constructor(studentSubmission){
        super(studentSubmission);
    }
    async getFields(fields){
        return await DriveJudge.drive.files.get({fileId:this.firstIdDriveFile(),fields:fields}).
        then(res=>res.data).
        catch(res=>({}));
    }
}

module.exports = DriveJudge;
