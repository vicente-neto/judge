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
                                try {
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
                                    
                                } catch (error) {
                                    console.log(`${course.name}:${courseWork.title} sem juiz!`);
                                }
                               

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
                try {
                    let  path;
                    let Judge;
                    if(/(?<class>.*)\(python\)$/.test(courseWork.title)){
                        path = courseWork.title.match(/(?<path>.*)\(python\)$/).groups.path;    
                        Judge = new require("./src/infra/judge/pythonJudge");
                        
                    }else{
                        Judge = new require("./src/infra/judge/"+courseWork.title);
                    }
                    GoogleApi.studentSubmissionsByCourseWork(courseId,courseWork.id,false)
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
                                            judge.outcome(false);
                                            judge.publish(false); 
                                        });
                                        
                                    } catch (error) {
                                        console.log(error.toString());                                      
                                    }      
                            })
                        )
                    
                } catch (error) {
                    console.log(error);
                }
            }
        )
        .then(()=>console.log("submission scan completed"))
        .catch((rej)=>console.log(rej));
    }  

}

module.exports = Correct;