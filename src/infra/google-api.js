const {google} = require('googleapis');
const oAuth2Client = require("../config/oauth2client");
class GoogleApi {

    static getclassroom(){
        return google.classroom({version: "v1",auth:oAuth2Client});
    }
    static getdrive(){
        return google.drive({version: "v3",auth:oAuth2Client});
    }

    static getsheets(){
        return google.sheets({version: "v4",auth:oAuth2Client});
    }

    static getslides(){
        return google.slides({version: "v1",auth:oAuth2Client});
    }

    static getadmin(){
        return google.admin({version: 'reports_v1',auth:oAuth2Client});
    }

    static getdriveactivity(){
        return google.driveactivity({version: 'v2', auth:oAuth2Client});
    }

    

    static allCourses(){
        return GoogleApi.getclassroom().courses.list({
            courseStates: 'ACTIVE'
          }).then(res=>res.data.courses);
    }
    static getCourse(courseId){
        return GoogleApi.getclassroom().courses.get({
            id:courseId
          }).then(res=>res.data);
    }
    static courseWorksByCourse(courseId,pageSize=0){
        let parameters = { 
            courseId: courseId,
            pageSize: pageSize
        }
        let promise = GoogleApi.getclassroom().courses.courseWork.list(parameters)
            .then(  
                res=>
                res.data.courseWork.filter(
                    courseWork=>
                    courseWork.hasOwnProperty("associatedWithDeveloper")
                    ))
            .catch(rej=>[]);
        return promise;
    }

    static getCourseWork(courseId,courseWorkId){
        let parameters = { 
            courseId: courseId,
            id: courseWorkId
        }
        let promise = GoogleApi.getclassroom().courses.courseWork.get(parameters)
            .then(  
                res=>
                res.data)
            .catch(rej=>[]);
        return promise;
    }

    static studentSubmissionsByCourseWork(courseId,courseWorkId,all=false){
        return GoogleApi.getclassroom().courses.courseWork.studentSubmissions.list({
            courseId: courseId,
            courseWorkId: courseWorkId,
            states: 'TURNED_IN'
          })
            .then(  
                res=>
                res.data.studentSubmissions
                    .filter(
                        studentSubmission=>
                        all||studentSubmission.submissionHistory.pop().hasOwnProperty('stateHistory')
                    )
                )
            .catch(rej=>[]);
    }  



    static studentByUserId(courseId,userId){
        return GoogleApi.getclassroom().courses.students.get({
            courseId: courseId,
            userId: userId
          })
            .then(  
                res=>
                res.data.profile)
    }  
}

module.exports = GoogleApi;
