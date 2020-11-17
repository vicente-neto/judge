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
    let permissions = await service.permissions.list({fileId:list[i].drive.id,supportsAllDrives:true,fields:"*"}).then(res=>res);
    console.log(`${list[i].id}`);
    permissions.data.permissions.forEach(permission=>{
      console.log(`${list[i].drive.id},${list[i].drive.name},${permission.emailAddress}`);
    })
  }
  
 

  //console.log(list);

 //let files = await service.files.list({corpora:"drive",driveId:"0ADETJiY_8dIBUk9PVA",includeItemsFromAllDrives:true,supportsAllDrives:true}).then(res=>res.data.files);
 
//console.log(files);
  //service.revisions.list({fileId:"1LSfs4tfgwRLQ1upyGqckOwmdnJzjcW1M6u9Pn_1xDYI",fields:"*"}).then((res)=>console.log(res.data.revisions[0].lastModifyingUser.emailAddress));

}

main();



