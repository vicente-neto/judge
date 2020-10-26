const DriveJudge = require('./driveJudge');
const GoogleApi = require('../google-api');

class Planilhas3 extends DriveJudge{
    deliberate(){
        let service = GoogleApi.getsheets();
        return service.spreadsheets.get({
            spreadsheetId:this.firstIdDriveFile(),
            includeGridData: true,
            ranges:["'Página1'!D10","'Página1'!D11","'Página1'!D12","'Página1'!A1"]}
        ).then(res=>{
            try {
                let propertie = res.data.sheets[0].data[0].rowData[0].values[0].userEnteredValue.formulaValue; 
                this.assert(/COUNTIF/i.test(propertie),"verifique a fórmula de contagem condicional",25);
                propertie = res.data.sheets[0].data[1].rowData[0].values[0].userEnteredValue.formulaValue;
                this.assert(/COUNTIFS/i.test(propertie),"verifique a fórmula de contagem com várias condições",25);
                propertie = res.data.sheets[0].data[2].rowData[0].values[0].userEnteredValue.formulaValue;
                this.assert(/COUNTUNIQUE/i.test(propertie),"verifique a fórmula de contagem única",25);
                propertie = res.data.sheets[0].hasOwnProperty("merges");
                this.assert(propertie,"verifique se a célula A1 foi mesclada",25);
            } catch (error) {
                this.assert(false,"algumas solicitações estão pendentes",0) 
            }
           
        }).catch(rej=>this.assert(false,"planilha 'Página1' não encontrada",0));    
    }    
}

module.exports = Planilhas3;
