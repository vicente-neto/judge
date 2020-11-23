const DriveJudge = require('./driveJudge');
const GoogleApi = require('../google-api');

class Planilhas1 extends DriveJudge{
    deliberate(){
        let service = GoogleApi.getsheets();
        return service.spreadsheets.get({
            spreadsheetId:this.firstIdDriveFile(),
            includeGridData: true,
            ranges:["'Página1'!A1","'Página1'!D4"]}
        ).then(res=>{
            try {
                let propertie = res.data.sheets[0].data[0].rowMetadata.find(p=>p.hasOwnProperty("pixelSize")).pixelSize; 
                this.assert(propertie>=40,"linhas devem ter mais de 40 pixel",10);
                propertie = res.data.sheets[0].data[0].columnMetadata.find(p=>p.hasOwnProperty("pixelSize")).pixelSize;
                this.assert(propertie>=200,"colunas devem ter mais de 200 pixel",10);
                propertie = res.data.properties.title;
                this.assert(/Compartilhamento/i.test(propertie),"título deve ser 'Compartilhamento'",20);
                propertie = res.data.sheets[0].data[0].rowData[0].values[0].userEnteredFormat.horizontalAlignment;
                this.assert(propertie=="CENTER","células devem ter texto centralizado",20);
                propertie = res.data.sheets[0].data[1].rowData[0].values[0].formattedValue;
                this.assert(propertie=="R$ 2.000,00","coluna de VALOR deve ter mesmos valores e formatação",20);
                propertie = res.data.sheets[0].data[1].rowData[0].values[0].userEnteredFormat.verticalAlignment;
                this.assert(propertie=="MIDDLE","células devem ter alinhamento vertical",20);
            } catch (error) {
                this.assert(false,"algumas solicitações estão pendentes",0) 
            }
           
        }).catch(rej=>this.assert(false,"planilha 'Página1' não encontrada",0));    
    }    
}

module.exports = Planilhas1;
