const DriveJudge = require('./driveJudge');
const GoogleApi = require('../google-api');

class Planilhas8 extends DriveJudge{
    async deliberate(){

        let tests = [];
        let sheets = {};

        try {
            sheets.formulario = await GoogleApi.getPropertiesSheet(this.firstIdDriveFile(),"formulário!B2");
            tests.push(true);
        } catch (error) {
            console.log(error);
            tests.push(false);
        }

        try {
            sheets.redes = await GoogleApi.getPropertiesSheet(this.firstIdDriveFile(),"'redes sociais'!a1");
            tests.push(true);
        } catch (error) {
            tests.push(false);
        }

        try {
            sheets.percentuais = await GoogleApi.getPropertiesSheet(this.firstIdDriveFile(),"percentuais!B1");
            tests.push(true);
        } catch (error) {
            tests.push(false);
        }

        try {
            tests.push(
                sheets.formulario.data.sheets[0].hasOwnProperty("protectedRanges")     
            );
        } catch (error) {
            tests.push(false);
        }

        try {
            tests.push(
                sheets.formulario.data.sheets[0].properties.gridProperties.hasOwnProperty("frozenRowCount")    
            );
        } catch (error) {
            tests.push(false);
        }

        try {
            tests.push(
                sheets.redes.data.sheets[0].properties.hasOwnProperty("hidden")     
            );
        } catch (error) {
            tests.push(false);
        }



        try {
            tests.push(
                sheets.percentuais.data.sheets[0].data[0].columnMetadata[0].hasOwnProperty("hiddenByUser")
            );
        } catch (error) {
            tests.push(false);
        }

        try {
            await GoogleApi.batchUpdateSheet(
                this.firstIdDriveFile(),
                [
                    {
                        "range": "'formulário'!B2",
                        "majorDimension": "ROWS",
                        "values": [ ["Instagram"] ]
                    }
                ]
            );
            let data = await GoogleApi.batchGetSheet(this.firstIdDriveFile(),[
                "'percentuais'!c2"
            ]);
            let [c2] = data.valueRanges.map((range)=>range.hasOwnProperty("values")?range.values[0][0]:""); 
            await GoogleApi.batchUpdateSheet(
                this.firstIdDriveFile(),
                [
                    {
                        "range": "'formulário'!B2",
                        "majorDimension": "ROWS",
                        "values": [ ["Facebook"] ]
                    }
                ]
            );
            tests.push(/30,00%/.test(c2));
        } catch (error) {
            tests.push(false);
        }

        this.assert(tests[0],"página 'formulário' não encontrada",10);
        this.assert(tests[1],"página 'redes sociais' não encontrada",10);
        this.assert(tests[2],"página 'percentuais' não encontrada",10);

        if(tests[0]){
            this.assert(tests[3],"proteja a página 'formulário'",15);   
            this.assert(tests[4],"verifique se existe um formulário vinculado a página 'formulário'",15); 
        }

        if(tests[1]){
            this.assert(tests[5],"oculte a página 'redes sociais'",10);
        }

        if(tests[2]){
            this.assert(tests[6],"coluna B de percentuais deve ser oculta",15);
            this.assert(tests[7],"problema nas fórmulas da coluna C de percentuais",15);
        }
    }    
}

module.exports = Planilhas8;
