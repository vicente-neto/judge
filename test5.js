const { drive } = require('googleapis/build/src/apis/drive');
const GoogleApi = require('./src/infra/google-api');

const service = GoogleApi.getclassroom();

async function main(){

  service.courses.students.list({courseId:"178439734263"}).then(res=>
    console.log(res)
);


}

main();



