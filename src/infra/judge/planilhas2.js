const DriveJudge = require('./driveJudge');
const GoogleApi = require('../google-api');

class Planilhas2 extends DriveJudge{
    deliberate(){
        let service = GoogleApi.getsheets();
        return service.spreadsheets.get({
            spreadsheetId:this.firstIdDriveFile(),
            includeGridData: true,
            ranges:["'Página1'!D5","'Página1'!D6","'Página1'!D7","'Página1'!D8","'Página1'!C8"]}
        ).then(res=>{
            try {
                let propertie = res.data.sheets[0].data[0].rowData[0].values[0].userEnteredValue.formulaValue; 
                this.assert(/sum/i.test(propertie),"verifique a fórmula de soma",20);
                propertie = res.data.sheets[0].data[1].rowData[0].values[0].userEnteredValue.formulaValue;
                this.assert(/SUMSQ/i.test(propertie),"verifique a fórmula de soma dos quadrados",20);
                propertie = res.data.sheets[0].data[2].rowData[0].values[0].userEnteredValue.formulaValue;
                this.assert(/SUMIF/i.test(propertie),"verifique a fórmula de soma condicional",20);
                propertie = res.data.sheets[0].data[3].rowData[0].values[0].userEnteredValue.formulaValue;
                this.assert(/SUMIFS/i.test(propertie),"verifique a fórmula de soma de várias condições",20);
                propertie = res.data.sheets[0].data[4].rowData[0].values[0].userEnteredFormat.wrapStrategy;
                this.assert(/WRAP/i.test(propertie),"verifique o ajuste de texto das células da Coluna C",20);
            } catch (error) {
                this.assert(false,"algumas solicitações estão pendentes",0) 
            }
           
        }).catch(rej=>this.assert(false,"planilha 'Página1' não encontrada",0));    
    }    
}

module.exports = Planilhas2;
