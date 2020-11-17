const GoogleApi = require('./src/infra/google-api');

const service = GoogleApi.getclassroom();

async function main(){

  let table = await service.courses.list({
    courseStates: 'ACTIVE'
  }).then((courses)=>courses.data.courses.map(course=>{
    let c = {
      id:course.id,
      title:course.name
    };
    return c;
  }
    
  ));

  for(let i=0;i<table.length;i++){
    let courseworks = await GoogleApi.courseWorksByCourse(table[i].id).then((courseworks)=>courseworks.map(coursework=>{return {id:coursework.id,title:coursework.title}}));
    


    for(let j=0;j<courseworks.length;j++){
      //console.log(table[i].id+":"+courseworks[j].id);
      let grades = await GoogleApi.studentGradeByCourseWork(table[i].id,courseworks[j].id,true).then(submissions=>submissions.map(submission=>{return {userId:submission.userId,grade:submission.assignedGrade}}));
      courseworks[j].grades = grades;
      
    }


    table[i].courseworks = courseworks;
  }


  for(let i=0;i<table.length;i++){
    if(table[i].courseworks!=undefined)
    for(let j=0;j<table[i].courseworks.length;j++){
      if(table[i].courseworks[j].grades!=undefined)
      for(let k=0;k<table[i].courseworks[j].grades.length;k++){
        console.log(`${table[i].id},${table[i].title},${table[i].courseworks[j].id},${table[i].courseworks[j].title},${table[i].courseworks[j].grades[k].userId},${table[i].courseworks[j].grades[k].grade}`);
      }
    }  
  }
}

main();


