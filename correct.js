const GoogleApi = require('./src/infra/google-api');

class Correct{
    static getJudgeCourseWork(courseWork){
        let description = courseWork.description;
        let regex = /judge(\.[a-z]+)+/g;
        let judge = description.match(regex);
        if(!judge){
            return judge;
        }    
        judge = judge.replace(/\./, '/');
    }
    static reviewCourseWork(courseWork){
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
    }
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


    static runByStudent(name,title,email,submeter){
        GoogleApi.studentSubmissions(name,title,email)
        .then(
            cws=>{
                
                try {
                    let  path;
                    let Judge;
                    if(/(?<class>.*)\(python\)$/.test(cws.coursework.title)){
                        path = cws.coursework.title.match(/(?<path>.*)\(python\)$/).groups.path;    
                        Judge = new require("./src/infra/judge/pythonJudge");
                        
                    }else{
                        Judge = new require("./src/infra/judge/"+cws.coursework.title);
                    }
                    try { 
                        let judge;       
                        if(path){
                            judge = new Judge(path);
                        }else{
                            judge = new Judge();
                        }
                        judge.init(cws.student);                 
                        judge.deliberate().then(()=>{
                            judge.outcome(submeter=="true");
                            judge.publish(submeter=="true"); 
                        }); 
                    } catch (error) {
                        console.log("1");
                        console.log(error.toString());                                      
                    }    
                } catch (error) {
                    console.log("2");
                    console.log(error);
                }
            }
        )
        .catch((rej)=>console.log(rej));
    }  

}

module.exports = Correct;