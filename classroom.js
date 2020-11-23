const GoogleApi = require('./src/infra/google-api');
const fs = require('fs');

let params = process.argv.splice(2);

switch (params.shift()) {
    case "list-courses":
        GoogleApi.allCourses().then((courses)=>courses.forEach(course => {
            console.log(`${course.id},${course.name}`);
        }));
        break;
    case "emails":
        GoogleApi.allCourses().then((courses)=>courses.forEach(course => {
            console.log(`${course.courseGroupEmail}`);
        }));
        break;
    case "show-course":
        GoogleApi.getCourse(params.shift()).then((course)=>console.log(course));
        break;
    case "show-students":
        GoogleApi.allCourses().then(courses=>{
            courses.forEach(course=>{
                console.log(course.id);
                GoogleApi.studentsByCourse(course.id).then(res=>
                    res.forEach(e=>
                        fs.appendFile('alunos.txt', e+"\n", function (err) {
                            if (err) throw err;
                            
                          }) 
                    )   
                );

            });
            
            
        });
       
        break;
    case "show-students2":
        GoogleApi.studentsByCourse(params[0]).then(res=>
            console.log(res)
        );
       
        break;
    case "add-coursework":
        GoogleApi.getclassroom().courses.courseWork.create(
            {
                courseId:params.shift(),
                requestBody: {
                    "description": "created by judge",
                    "state": "DRAFT",
                    "title": "title",
                    "workType": "ASSIGNMENT"
                }
            })
                .then(coursework => console.log(coursework))
                .catch(erro => console.log(erro));
        break;
    case "list-courseworks":
        GoogleApi.getclassroom().courses.courseWork.list(
            {
                courseId:params.shift()
            })
                .then(courseworks => courseworks.data.courseWork.filter((coursework)=>true).forEach(coursework => {
                    console.log(`${coursework.courseId},${coursework.id},${coursework.title}, - topicId:${coursework.topicId}`);
                }));
        break;
    case "list-students":
        students();
        break;
    case "clone-topic-coursework":
        let courseSource = params.shift();
        let topic = params.shift();
        console.log(topic);
        let coursesDestiny = params;

        coursesDestiny.forEach((course)=>{
        
            GoogleApi.getclassroom().courses.courseWork.list({courseId:courseSource})
                .then(courseworks => courseworks.data.courseWork.filter((coursework)=>coursework.topicId==topic).forEach(coursework => {
                    
                    GoogleApi.getclassroom().courses.courseWork.create(
                        {
                            courseId:course,
                            requestBody: {
                                "description": coursework.description,
                                "state": "PUBLISHED",
                                "title": coursework.title,
                                "workType": "ASSIGNMENT",
                                "materials": coursework.materials,
                                "maxPoints": coursework.maxPoints

                            }
                        })
                            .then(coursework => console.log("coursework criado"))
                            .catch(erro => console.log(erro));
                }));
        });
        break;
    case "update-courseworks":
        let title = params.shift();
        let description = params.shift();
        let er = new RegExp(title,"i");
    GoogleApi.allCourses().then((courses)=>courses.forEach(course => {
   
        GoogleApi.courseWorksByCourse(course.id)
                .then(courseworks => {
                   
                  
                        
                        courseworks.filter((coursework)=>er.test(coursework.title)).forEach(coursework => {
                            GoogleApi.getclassroom().courses.courseWork.patch(
                                {
                                    courseId:course.id,
                                    id:coursework.id,
                                    updateMask:"description",
                                    requestBody: {
                                        "description": description
                                    }
                                })
                                    .then(coursework => console.log("coursework atualizado"))
                                    .catch(erro => console.log(erro));
                            
                        })
                    
                    
            });
    }));
    break;

    case "update-grade":
        updateGrade();
    break;


    case "grade-courseworks":
        
        grades(params.shift(),params.shift(),params.shift());
    
    break;


    
    case "submission-student":
        
        submissionByStudent(params.shift(),params.shift(),params.shift());
    
    break;












    case "get-coursework":
        GoogleApi.getclassroom().courses.courseWork.get(
            {
                courseId:params.shift(),
                courseId:params.shift()
            })
                .then(coursework => console.log(coursework))
                .catch(erro => console.log(erro));
        break;
    default:
        break;
}

async function updateGrade(){
    let data = await GoogleApi.batchGetSheet("17vP0AEGF-XrWF7Q0RIG1LkWxVR8gUeI7KbUFVUkJrig",[
        `'importnotas'!B:C`
    ]);
    let submissions = data.valueRanges[0].values;
}

    async function grades(){
        let courses = await GoogleApi.allCourses();
        for(course of courses){
            let courseworks = await GoogleApi.courseWorksByCourse(course.id);
            for(coursework of courseworks){
                let submissions = await GoogleApi.studentGradeByCourseWork(course.id,coursework.id,true);
                for(submission of submissions){
                    let student = await GoogleApi.studentByUserId(course.id,submission.userId);
                    console.log(student);
                    fs.appendFile('alunos.txt', course.name+","+coursework.id+","+coursework.title+","+submission.userId+","+submission.assignedGrade+","+student.name.fullName+","+student.emailAddress+"\n", function (err) {
                        if (err) throw err; 
                        
                      });
                }
            }
                  
        }
    
    
    }


    async function grades(courseId,first,last){
        let courseworks = await GoogleApi.courseWorksByCourse(courseId);
        let i=0;
        for(coursework of courseworks){
            i++;
            if(i>=first&&i<=last){
                console.log(coursework.title);
                let submissions = await GoogleApi.studentGradeByCourseWork(courseId,coursework.id,true);
                for(submission of submissions){
                   // console.log(submission);
                    let student = await GoogleApi.studentByUserId(courseId,submission.userId);
                    console.log(student.name.fullName);
                    fs.appendFile('alunos.txt', coursework.id+","+coursework.title+","+submission.userId+","+submission.assignedGrade+","+student.name.fullName+","+student.emailAddress+"\n", function (err) {      if (err) throw err;   });
                }
            }
            
        }
    
    
    }


    async function students(){
        let courses = await GoogleApi.allCourses();
        for(course of courses){
            let nameFile = "studentsOf"+course.name+".txt";
            let students = await GoogleApi.studentsByCourse(course.id);
            for(student of students){
                fs.appendFile(nameFile, student+"\n", function (err) {      if (err) throw err;   });
            }
        }
    }

    async function submissionByStudent(name,title,email){
        console.log("teste");
        let submission = await GoogleApi.studentSubmissions(name,title,email);
        console.log(submission);
        
    }

  //GoogleApi.

/*
    classroom courses - listar courses
    classroom courseWork [idCourse] - criar courseWork em um course especificado
*/

