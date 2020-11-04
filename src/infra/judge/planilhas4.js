const DriveJudge = require('./driveJudge');
const GoogleApi = require('../google-api');

class Planilhas4 extends DriveJudge{
    async deliberate(){
        let line = Math.floor((Math.random() * 100) + 1);

        let data = await GoogleApi.batchGetSheet(this.firstIdDriveFile(),[`grupos!A${line}`]);
        let name = data.valueRanges[0].values[0][0];
        await GoogleApi.batchUpdateSheet(
            this.firstIdDriveFile(),
            [
                {
                    "range": "pesquisa!A2",
                    "majorDimension": "ROWS",
                    "values": [ [line] ]
                },
                {
                    "range": "pesquisa!B5",
                    "majorDimension": "ROWS",
                    "values": [ [name] ]
                },
                {
                    "range": "pesquisa!B8",
                    "majorDimension": "ROWS",
                    "values": [ [name] ]
                }
            ]
        );

        data = await GoogleApi.batchGetSheet(this.firstIdDriveFile(),
            [
                "pesquisa!C2",
                "pesquisa!C5",
                `grupos!E${line}`,
                "pesquisa!C8"
            ]
        );

        let [c2,c5,ocorrencias,c8] = data.valueRanges.map((range)=>range.values[0][0]); 

        let regexp = new RegExp(name,"i");
        this.assert(regexp.test(c2),"problema na pesquisa por linha/coluna",25);

        regexp = new RegExp(line,"i");
        this.assert(regexp.test(c5),"problema na pesquisa de linha pelo nome",25);

        regexp = new RegExp(ocorrencias,"i");
        this.assert(regexp.test(c8),"problema na pesquisa de ocorrências",25);

        await GoogleApi.batchUpdateSheet(
            this.firstIdDriveFile(),
            [
                {
                    "range": "pesquisa!B8",
                    "majorDimension": "ROWS",
                    "values": [ [line] ]
                }
            ]
        );

        data = await GoogleApi.batchGetSheet(this.firstIdDriveFile(),
            [
                "pesquisa!C8"
            ]
        );

        [c8] = data.valueRanges.map((range)=>range.values[0][0]); 

        this.assert(/NOME INEXISTENTE/i.test(c8),"problema na pesquisa por dados inexistentes",25);
    }    
}

module.exports = Planilhas4;
