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

    static batchUpdateSheet(id,ranges){
        return GoogleApi.getsheets().spreadsheets.values.batchUpdate({
            spreadsheetId: id,  
            requestBody:{
                "valueInputOption":'USER_ENTERED',
                "data":ranges
              }
        })
        .then(()=>true)
        .catch(()=>false);
    }

    static getPropertiesSheet(id,range){
        return GoogleApi.getsheets().spreadsheets.get(
            {
                spreadsheetId:id,
                ranges:range,
                includeGridData:true
            }
        )
        .then((sheet)=>sheet)
        .catch(()=>undefined);
}
    

    static getCellSheet(id,range){
            return GoogleApi.getsheets().spreadsheets.get(
                {
                    spreadsheetId:id,
                    includeGridData: true,
                    ranges:range
                }
            )
            .then((sheet)=>sheet.data.sheets[0].data[0].rowData[0].values[0].formattedValue)
            .catch(()=>undefined);
    }

    static cells(id,range){
        return GoogleApi.getsheets().spreadsheets.get(
            {
                spreadsheetId:id,
                includeGridData: true,
                ranges:range
            }
        )
        .then((res)=>{
            let formulas = [];
            res.data.sheets.forEach((sheet)=>
                sheet.data.forEach((data)=>
                    data.rowData.forEach((row)=>
                        row.values.forEach((value)=>
                            formulas.push(value)
                        )
                    )
                )
            );
            return formulas
        })
        .catch(()=>undefined);
}

    
    static batchGetSheet(id,ranges){
        return GoogleApi.getsheets().spreadsheets.values.batchGet(
            {
                spreadsheetId: id, 
                majorDimension: "ROWS", 
                ranges:ranges
            }
        )
        .then((res)=>res.data)
        .catch(()=>undefined);
    }

  

    static getValuesSheet(id,range){
        return GoogleApi.getsheets().spreadsheets.get(
            {
                spreadsheetId:id,
                includeGridData: true,
                ranges:range
            }
        )
        .then((sheet)=>sheet.data.sheets[0].data.map((data)=>data.rowData[0].values[0].formattedValue))
        .catch(()=>undefined);
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
                res=>{
                    if(res.data.courseWork){
                        return res.data.courseWork.filter(
                            courseWork=>
                            courseWork.hasOwnProperty("associatedWithDeveloper")
                            )
                    }
                    else{
                        return [];
                    }
                })
            .catch(rej=>[]);
        return promise;
    }


    static studentsByCourse(courseId,pageToken=undefined){

        let parameters = { 
            courseId: courseId
        }
        if(pageToken){
            parameters.pageToken = pageToken;
        }
        let promise = GoogleApi.getclassroom().courses.students.list(parameters)
            .then(  
                async res=>{
                    let students = [];
                    if(res.data.nextPageToken){
                        let stu = await GoogleApi.studentsByCourse(courseId,res.data.nextPageToken);
                        students = students.concat(stu); 
                        
                    }

                    return students.concat(res.data.students.map(student=>{
                        
                        return courseId+","+student.profile.id+","+student.profile.name.fullName+","+student.profile.emailAddress;
                    }));
                    
                })
            .catch(rej=>[rej]);
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


    static studentGradeByCourseWork(courseId,courseWorkId,all=false){
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
                    ).map(studentSubmission=>{
                        return studentSubmission;
                    })
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


    static studentByCourse(courseId){
        return GoogleApi.getclassroom().courses.students.list({
            courseId: courseId,
            pageSize: 5
          })
            .then(  
                res=>
                res)
    } 

}

module.exports = GoogleApi;
