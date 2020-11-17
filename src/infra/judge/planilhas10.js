const DriveJudge = require('./driveJudge');
const GoogleApi = require('../google-api');

class Planilhas10 extends DriveJudge{
    async deliberate(){
        
        let formulario;

        try {
            formulario = await GoogleApi.getPropertiesSheet(this.firstIdDriveFile(),"'movimentações'!A2:D2");
  
        } catch (error) {
            this.assert(false,"verifique se existe a página 'movimentações'!",0);
            return;
        }


        let tests = [];

        try {
            tests.push(
                formulario.data.sheets[0].data[0].rowData[0].values[0].effectiveFormat.numberFormat.type
                ==
                "DATE_TIME"
                );  
        } catch (error) {
            tests.push(false); 
        }

        try {
            tests.push(
                formulario.data.sheets[0].data[0].rowData[0].values[1].dataValidation.condition.type
                ==
                "ONE_OF_RANGE"
                );  
        } catch (error) {
            tests.push(false); 
        }

        try {
            tests.push(
                formulario.data.sheets[0].data[0].rowData[0].values[2].dataValidation.condition.type
                ==
                "ONE_OF_LIST"
                );  
        } catch (error) {
            tests.push(false); 
        }

        try {
            tests.push(
                formulario.data.sheets[0].data[0].rowData[0].values[3].dataValidation.condition.type
                ==
                "NUMBER_GREATER"
                );  
        } catch (error) {
            tests.push(false); 
        }

        try {
            tests.push(
                formulario.data.sheets[0].conditionalFormats[0].booleanRule.condition.type
                ==
                "CUSTOM_FORMULA"
                );  
        } catch (error) {
            tests.push(false); 
        }

        this.assert(tests.shift(),"problema na formatação de data/hora de movimentações",20);
        this.assert(tests.shift(),"problema na validação de dados de produtos em movimentações",20);
        this.assert(tests.shift(),"problema na validação de dados de tipo em movimentações",20);
        this.assert(tests.shift(),"problema na validação de dados de quantidade em movimentações",20);
        this.assert(tests.shift(),"problema na formatação condicional em movimentações",20);



    }    
}

module.exports = Planilhas10;
