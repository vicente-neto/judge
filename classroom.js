const GoogleApi = require('./src/infra/google-api');

let params = process.argv.splice(2);

switch (params.shift()) {
    case "list-courses":
        GoogleApi.allCourses().then((courses)=>courses.forEach(course => {
            console.log(`${course.id}:${course.name}`);
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
                    console.log(`${coursework.id}:${coursework.title} - topicId:${coursework.topicId}`);
                }));
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

  //GoogleApi.

/*
    classroom courses - listar courses
    classroom courseWork [idCourse] - criar courseWork em um course especificado
*/

