const DriveJudge = require('./driveJudge');
const GoogleApi = require('../google-api');

class Planilhas8 extends DriveJudge{
    async deliberate(){
        let formulario = await GoogleApi.getPropertiesSheet(this.firstIdDriveFile(),"formulário!B2");
        let redes = await GoogleApi.getPropertiesSheet(this.firstIdDriveFile(),"'redes sociais'!a1");
        let percentuais = await GoogleApi.getPropertiesSheet(this.firstIdDriveFile(),"percentuais!B1");

        
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


        this.assert(formulario.data.sheets[0].hasOwnProperty("protectedRanges"),"proteja a página 'formulário'",20);

        this.assert(redes.data.sheets[0].properties.hasOwnProperty("hidden"),"oculte a página 'redes sociais'",20);
      
        this.assert(formulario.data.sheets[0].properties.gridProperties.hasOwnProperty("frozenRowCount"),"verifique se existe um formulário vinculado a página 'formulário'",20);

        this.assert(percentuais.data.sheets[0].data[0].columnMetadata[0].hasOwnProperty("hiddenByUser"),"coluna B de percentuais deve ser oculta",20);

        this.assert(/30,00%/.test(c2),"problema nas fórmulas da coluna C de percentuais",20);
       

    }    
}

module.exports = Planilhas8;
