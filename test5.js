const { drive } = require('googleapis/build/src/apis/drive');
const GoogleApi = require('./src/infra/google-api');

const service = GoogleApi.getclassroom();

const service2 = GoogleApi.getsheets();

async function main(){



const res = await service2.spreadsheets.getByDataFilter({
  // The spreadsheet to request.
  spreadsheetId: '17vP0AEGF-XrWF7Q0RIG1LkWxVR8gUeI7KbUFVUkJrig',

  // Request body metadata
  requestBody: 
    // request body parameters
     {
       "dataFilters": [
        
  
          {
            "developerMetadataLookup": {
              


          
             "metadataValue" : "ssssssss"
            }
          }
          
       ],
       "includeGridData": true
    }
});
console.log(res.data.sheets);


}

main();



