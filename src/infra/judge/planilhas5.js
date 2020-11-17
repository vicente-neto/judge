const DriveJudge = require('./driveJudge');
const GoogleApi = require('../google-api');

class Planilhas5 extends DriveJudge{
    async deliberate(){
        let quantidade = Math.floor((Math.random() * 100) + 1);
        let g4,d16,g7,g13;

        try {
            await GoogleApi.batchUpdateSheet(
                this.firstIdDriveFile(),
                [
                    {
                        "range": "'vendas de combos'!C2",
                        "majorDimension": "ROWS",
                        "values": [ [quantidade] ]
                    }
                ]
            );

        } catch (error) {

            this.assert(false,"verifique se existe a página 'vendas de combos'",0);
            return;
        }

        try {
  
            let data = await GoogleApi.batchGetSheet(this.firstIdDriveFile(),[
                `'vendas de combos'!G4`,
                `'vendas de combos'!D16`,
                `'vendas de combos'!G7`,
                `'vendas de combos'!G13`
            ]);
            [g4,d16,g7,g13] = data.valueRanges.map((range)=>range.values[0][0]); 
        } catch (error) {

            this.assert(false,"verifique se existe a página 'vendas de combos'",0);
            return;
        }





        let regexp = new RegExp(quantidade,"i");
        this.assert(regexp.test(g4),"problema na pesquisa de quantidade",25);

        regexp = new RegExp(5975-353+quantidade,"i");
        this.assert(regexp.test(d16),"problema no acumulado",25);
        
        regexp = new RegExp(1484-353+quantidade,"i");
        this.assert(regexp.test(g7),"problema na pesquisa dos totais",25);

        regexp = new RegExp("Google","i");
        this.assert(regexp.test(g13),"problema no hiperlink",25);
     
    }    
}

module.exports = Planilhas5;
