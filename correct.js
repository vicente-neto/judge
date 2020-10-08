const GoogleApi = require('./src/infra/google-api');

class Correct{
    static run(){
        GoogleApi.allCourses()
        .then(
            courses=>
            courses.forEach(
                course =>
                GoogleApi.courseWorksByCourse(course.id)
                    .then(
                        courseWorks=>
                        courseWorks.forEach(
                            courseWork=>{
                                let  path;
                                let Judge;
                                if(/(?<class>.*)\(python\)$/.test(courseWork.title)){
                                    path = courseWork.title.match(/(?<path>.*)\(python\)$/).groups.path;    
                                    Judge = new require("./src/infra/judge/pythonJudge");
                                    
                                }else{
                                    Judge = new require("./src/infra/judge/"+courseWork.title);
                                }
                            GoogleApi.studentSubmissionsByCourseWork(course.id,courseWork.id,false)
                                .then(
                                    studentSubmissions=>   
                                    studentSubmissions.forEach(
                                        studentSubmission=>{
                                            try { 
                                                let judge;       
                                                if(path){
                                                    judge = new Judge(path);
                                                }else{
                                                    judge = new Judge();
                                                }
                                                judge.init(studentSubmission);                 
                                                judge.deliberate().then(()=>{
                                                    judge.outcome(true);
                                                    judge.publish(true); 
                                                });
                                                
                                            } catch (error) {
                                                console.log(error.toString());                                      
                                            }     
                                    })
                                )
                            })
                )
            ))
        .then(()=>console.log("submission scan completed"))
        .catch((rej)=>console.log(rej));
    }  

    static runCourseWork(courseId,courseWorkId){
        GoogleApi.getCourseWork(courseId,courseWorkId)
        .then(
            courseWork=>{
                let  path;
                let Judge;
                
                if(/(?<class>.*)\(python\)$/.test(courseWork.title)){
                    path = courseWork.title.match(/(?<path>.*)\(python\)$/).groups.path;    
                    Judge = new require("./src/infra/judge/pythonJudge");
                    
                }else{
                    Judge = new require("./src/infra/judge/"+courseWork.title);
                }
                GoogleApi.studentSubmissionsByCourseWork(courseId,courseWorkId,true)
                    .then(
                        studentSubmissions=>   
                        studentSubmissions.forEach(
                            studentSubmission=>{
                                try {     
                                    let judge;   
                                    if(path){
                                        judge = new Judge(path);
                                    }else{
                                        judge = new Judge();
                                    }
                                    judge.init(studentSubmission);                 
                                    judge.deliberate().then(()=>{
                                        judge.outcome(true);
                                        judge.publish(false); 
                                    });  
                                } catch (error) {
                                    console.log(error.toString());                                      
                                }     
                        })
                    )
            }
        )
        .then(()=>console.log("submission scan completed"))
        .catch((rej)=>console.log(rej));
    }  

}

module.exports = Correct;