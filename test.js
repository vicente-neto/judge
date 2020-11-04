const GoogleApi = require('./src/infra/google-api');


GoogleApi.getsheets().spreadsheets.values.batchGet(
    {
        spreadsheetId: "1UguzLt_WxsjbD0tKM2garaunUwDooeP9MGA2sERltcs", 
        majorDimension: "ROWS", 
        ranges:[
            "'tabela'!K12",
            "'tabela'!o4",
            "'tabela'!o5",
            "'tabela'!o6",
            "'tabela'!o7"
        ]
    }
)
.then((res)=>console.log(res))
.catch((rej)=>console.log(rej));