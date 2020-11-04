const GoogleApi = require('../infra/google-api');   
const googleSheets = GoogleApi.getsheets(); 

class GoogleController{
    static routers() {
        return {
            test: "/teste/:id/:idreference/:na1",
            findCourse: '/google/course',
            findCourseWork: '/google/coursework/:idcourse',
            createCourseWork: '/google/coursework/create',
            judgeCourseWork: '/judge/google/coursework'
        };
    }
    test(){
        return function(req, res) {
           // console.log(req);
           GoogleController.asyncGetRange(req.params.idreference,req.params.na1);
           
           res.status(201).json("coursework");
            
        };
    }
    static async asyncBatchUpdate(id,requests){
        await googleSheets.spreadsheets.batchUpdate({
            spreadsheetId: id,  
            resource: { requests:requests }});
    }

    static async asyncGetRange(id,ranges){
        let sheets = await googleSheets.spreadsheets.get({
                spreadsheetId:id,
                includeGridData: true,
                ranges:ranges}
            ).then((sheet)=>{
                return sheet.data.sheets; 
            }   
        );
        console.log(sheets[0].data[0].rowData[0].values[0].userEnteredValue.formulaValue);
    }

    findCourse() {
        return function(req, res) {
            GoogleApi.getclassroom().courses.list()
                    .then(courses => res.status(201).json(courses.data.courses))
                    .catch(erro => console.log(erro));
           
        };
    }
    findCourseWork() {
        return function(req, res) {
            console.log(req);
            const idcourse = req.params.idcourse;
            GoogleApi.getclassroom().courses.courseWork.list({courseId:idcourse})
                    .then(courseworks => res.status(201).json(
                        courseworks.data.courseWork.filter((coursework)=>coursework.associatedWithDeveloper).map(
                            (coursework)=>(
                                {
                                    idcourse:coursework.courseId,
                                    id:coursework.id,
                                    title:coursework.title,
                                    coursework:coursework
                                }
                        )))
                    )
                    .catch(erro => console.log(erro));

           
        };
    }

    createCourseWork() {
        return function(req, res) {
            GoogleApi.getclassroom().courses.courseWork.create(req.body)
                    .then(coursework => res.status(201).json(coursework))
                    .catch(erro => console.log(erro));
        };
    }

    judgeCourseWork() {
        return function(req, res) {
            GoogleApi.allCourses()
                .then(
                    courses=>
                    courses.forEach(course =>{ 
                        GoogleApi.courseWorksByCourse(course.id,3).then(courseWorks=>{
                            courseWorks.forEach(courseWork=>{
                                console.log(courseWork.title);
                                console.log(courseWork.title.match(/\(python\)$/));
                                const Judge = require("../infra/judge/"+courseWork.title);
                                GoogleApi.studentSubmissionsByCourseWork(course.id,courseWork.id).then(studentSubmissions=>{    
                                    studentSubmissions.forEach(studentSubmission=>{
                                        const judge = new Judge(studentSubmission);
                                        judge.deliberate();
                                    })
                                })
                            })
                        })
                    })
                ).then(()=>res.status(201).json(true)).catch(()=>res.status(201).json(false));
        };
      
    }

}

module.exports = GoogleController;