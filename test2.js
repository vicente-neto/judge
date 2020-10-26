const Googleapi = require("./src/infra/google-api");

let service = Googleapi.getsheets();
service.spreadsheets.get(
  {
    spreadsheetId:"1V0mKNQQP67HuJIr-X_xQ4Boa7AIVKjBiZmMmCq3XBnA",
    includeGridData: true,
    ranges:["'Página1'!D10","'Página1'!D11","'Página1'!D12","'Página1'!A1"]
  }
)
  .then((res)=>{
    try {
      //console.log(JSON.stringify(res.data.sheets[0].data[0],null," "));
      console.log(res.data.sheets[0].data[0].rowData[0].values[0].userEnteredValue.formulaValue);
      console.log(res.data.sheets[0].data[1].rowData[0].values[0].userEnteredValue.formulaValue);
      console.log(res.data.sheets[0].data[2].rowData[0].values[0].userEnteredValue.formulaValue);
      console.log(res.data.sheets[0].hasOwnProperty("merges"));
      
  } catch (error) {
      console.log("algumas solicitções estão pendentes") 
  }

  }).catch(rej=>console.log("teste"));  

