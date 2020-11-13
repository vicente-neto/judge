const DriveJudge = require('./driveJudge');
const GoogleApi = require('../google-api');

class Planilhas7 extends DriveJudge{
    async deliberate(){
        let novoCombo = Math.floor((Math.random() * 10) + 10);
        let novaQuantidade = Math.floor((Math.random() * 10) + 1);

        await GoogleApi.batchUpdateSheet(
            this.firstIdDriveFile(),
            [
                {
                    "range": "'tabela'!A12",
                    "majorDimension": "ROWS",
                    "values": [ [600] ]
                },                {
                    "range": "'tabela'!o2",
                    "majorDimension": "ROWS",
                    "values": [ [11] ]
                },                {
                    "range": "'tabela'!o3",
                    "majorDimension": "ROWS",
                    "values": [ [600] ]
                }
            ]
        );

        let data = await GoogleApi.batchGetSheet(this.firstIdDriveFile(),[
            "'tabela'!K12",
            "'tabela'!o4",
            "'tabela'!o5",
            "'tabela'!o6",
            "'tabela'!o7"
        ]);
        

      
        let [k12,o4,o5,o6,o7] = data.valueRanges.map((range)=>range.hasOwnProperty("values")?range.values[0][0]:""); 
        
        
        await GoogleApi.batchUpdateSheet(
            this.firstIdDriveFile(),
            [
                {
                    "range": "'tabela'!A12",
                    "majorDimension": "ROWS",
                    "values": [ [500] ]
                },                {
                    "range": "'tabela'!o2",
                    "majorDimension": "ROWS",
                    "values": [ [2] ]
                },                {
                    "range": "'tabela'!o3",
                    "majorDimension": "ROWS",
                    "values": [ [50] ]
                }
            ]
        );

        console.log([k12,o4,o5,o6,o7]);
        let regexp = new RegExp(/75,60/,"i");
        this.assert(regexp.test(k12),"problema na tabela",20);
        regexp = new RegExp(/75,60/,"i");
        this.assert(regexp.test(o4),"problema no adicional",20);
        regexp = new RegExp(/675,60/,"i");       
        this.assert(regexp.test(o5),"problema no preço final",20);
        regexp = new RegExp(/61,41/,"i");
        this.assert(regexp.test(o6),"problema nas parcelas",15);
        regexp = new RegExp(/61,50/,"i");
        this.assert(regexp.test(o7),"problema na parcela final",15);
        regexp = new RegExp(/R\$ 61,50/,"i");
        this.assert(regexp.test(o7),"problema na formatação de moeda",10);

      
     
    }    
}

module.exports = Planilhas7;
