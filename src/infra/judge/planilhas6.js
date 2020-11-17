const DriveJudge = require('./driveJudge');
const GoogleApi = require('../google-api');

class Planilhas6 extends DriveJudge{
    async deliberate(){
        let novoCombo = Math.floor((Math.random() * 10) + 10);
        let novaQuantidade = Math.floor((Math.random() * 10) + 1);
        let aviso;
        let a7,a2,a3,d16;

        try {
            await GoogleApi.batchUpdateSheet(
                this.firstIdDriveFile(),
                [
                    {
                        "range": "'vendas de combos'!A16",
                        "majorDimension": "ROWS",
                        "values": [ [novoCombo] ]
                    },
                    {
                        "range": "'vendas de combos'!C16",
                        "majorDimension": "ROWS",
                        "values": [ [novaQuantidade] ]
                    },
                    {
                        "range": "'filtro por combo'!A1",
                        "majorDimension": "ROWS",
                        "values": [ [novoCombo] ]
                    }
                ]
            );
        } catch (error) {

            this.assert(false,"verifique se existe as páginas 'filtro por combo' e 'vendas de combos'",0);
            return;
        }
        try {
            let data = await GoogleApi.batchGetSheet(this.firstIdDriveFile(),[
                `'combos'!A7`,
                `'ordenado por quantidade'!A2`,
                `'filtro por combo'!A3`,
                `'vendas de combos'!D16`
            ]);
            //console.log(data);
            [a7,a2,a3,d16] = data.valueRanges.map((range)=>range.hasOwnProperty("values")?range.values[0][0]:""); 
    
        } catch (error) {

            this.assert(false,"verifique se existe as páginas 'combos','ordenado por quantidade','filtro por combo' e 'vendas de combos'",0);
            return;
        }
        try {
            await GoogleApi.batchUpdateSheet(
                this.firstIdDriveFile(),
                [
                    {
                        "range": "'vendas de combos'!C16",
                        "majorDimension": "ROWS",
                        "values": [ [""] ]
                    }
                ]
            );
        } catch (error) {
            console.log(error);
            this.assert(false,"verifique se existe a página 'vendas de combos'",0);
            return;
        }

       
        try {
            let data = await GoogleApi.batchGetSheet(this.firstIdDriveFile(),[
                `'vendas de combos'!D16`
            ]);
            [aviso] = data.valueRanges.map((range)=>range.values[0][0]);      

        } catch (error) {
            console.log(error);
            this.assert(false,"verifique a existência a página 'vendas de combos'",0);
            return;
        }
              
        let regexp = new RegExp(novoCombo,"i");
        this.assert(regexp.test(a7),"problema na lista de combos",25);

        this.assert(regexp.test(a2),"problema na ordenação",25);
        
        this.assert(regexp.test(a3),"problema no filtro",25);

        this.assert(/^$/.test(d16)&&/preencha a quantidade/i.test(aviso),"problema na observação",25);
     
    }    
}

module.exports = Planilhas6;
