const GoogleApi = require('../infra/google-api');    

class GoogleController{
    static routers() {
        return {
            findCourse: '/google/course',
            findCourseWork: '/google/coursework/:idcourse',
            createCourseWork: '/google/coursework/create',
            judgeCourseWork: '/judge/google/coursework'
        };
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
                    .then(coursework =>res.redirect(coursework))
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