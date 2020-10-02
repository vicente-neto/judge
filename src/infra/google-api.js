const {google} = require('googleapis');
const oAuth2Client = require("../config/oauth2client");
class GoogleApi {

    static getclassroom(){
        return google.classroom({version: "v1",auth:oAuth2Client});
    }
    static getdrive(){
        return google.drive({version: "v3",auth:oAuth2Client});
    }
    static allCourses(){
        return GoogleApi.getclassroom().courses.list({
            courseStates: 'ACTIVE'
          }).then(res=>res.data.courses);
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
    static studentSubmissionsByCourseWork(courseId,courseWorkId){
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
                        studentSubmission.submissionHistory.pop().hasOwnProperty('stateHistory')))
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
