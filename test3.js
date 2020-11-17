const { drive } = require('googleapis/build/src/apis/drive');
const GoogleApi = require('./src/infra/google-api');

const service = GoogleApi.getdrive();

async function main(){

  var emails = new Map();

  let list = await service.drives.list({pageSize:12}).then(res=>res.data.drives);

  list = list.map(it=>{
    return {drive:it}
  });
  
  for(let i=0;i<list.length;i++){
    let files = await service.files.list({corpora:"drive",driveId:list[i].drive.id,includeItemsFromAllDrives:true,supportsAllDrives:true}).then(res=>res.data.files);
    for(j=0;j<files.length;j++){
     // console.log(files[j]);
      if(/document|spreadsheet|presentation|pdf/i.test(files[j].mimeType)){
        let revisions = await service.revisions.list({fileId:files[j].id,fields:"*"}).then((res)=>res.data.hasOwnProperty("revisions")?res.data.revisions:[]);
        files[j].emails = revisions.map((revision)=>revision);
        files[j].emails.forEach(email=>{
          if(email.lastModifyingUser){
            // console.log(email);
          console.log(
            `${list[i].drive.name},${files[j].id},${files[j].name},${email.lastModifyingUser.emailAddress}`
         );
          }
          
        });
      }
      
    }
    list[i].drive.files = files;
    
  }
 

 // console.log(list);

 //let files = await service.files.list({corpora:"drive",driveId:"0ADETJiY_8dIBUk9PVA",includeItemsFromAllDrives:true,supportsAllDrives:true}).then(res=>res.data.files);
 
//console.log(files);
  //service.revisions.list({fileId:"1LSfs4tfgwRLQ1upyGqckOwmdnJzjcW1M6u9Pn_1xDYI",fields:"*"}).then((res)=>console.log(res.data.revisions[0].lastModifyingUser.emailAddress));

}

main();



