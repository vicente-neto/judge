const GoogleApi = require('./src/infra/google-api'); 
var cron = require('node-cron');   

cron.schedule('* * * * *', () => { 
    GoogleApi.allCourses()
    .then(
        courses=>
        courses.forEach(
            course =>
            GoogleApi.courseWorksByCourse(course.id,3)
                .then(
                    courseWorks=>
                    courseWorks.forEach(
                        courseWork=>{
                        const Judge = require("./src/infra/judge/"+courseWork.title);
                        GoogleApi.studentSubmissionsByCourseWork(course.id,courseWork.id)
                            .then(
                                studentSubmissions=>   
                                studentSubmissions.forEach(
                                    studentSubmission=>{
                                    const judge = new Judge(studentSubmission);
                                    judge.deliberate();
                                })
                            )
                        })
            )
        ))
    .then(()=>console.log("success"))
    .catch((rej)=>console.log(rej));
});