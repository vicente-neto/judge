const DriveJudge = require('./driveJudge');
const GoogleApi = require('../google-api');

class Planilhas9 extends DriveJudge{
    async deliberate(){
        let formulario = await GoogleApi.getPropertiesSheet(this.firstIdDriveFile(),"'América do Sul'!A1");
        let filter_brasil = false;
        let filter_ultima_semana = false;
        if(formulario.data.sheets[0].hasOwnProperty("filterViews")){
            filter_brasil = formulario.data.sheets[0].filterViews.some((filter)=>/Brasil/i.test(filter.title));
            filter_ultima_semana = formulario.data.sheets[0].filterViews.some((filter)=>/semana/i.test(filter.title));
        }

        let data = await GoogleApi.batchGetSheet(this.firstIdDriveFile(),[
            "'América do Sul'!A1:F1",
            "'América do Sul'!B2",
            "'América do Sul'!C2"
        ]);
        

      
        let [a1f1,b2,c2] = data.valueRanges.map((range)=>range.hasOwnProperty("values")?range.values[0]:""); 
       
        let header = [
            'location',
            'date',
            'total_cases',
            'new_cases',
            'total_deaths',
            'new_deaths'
        ];

        let diff = header.filter(c => !a1f1.includes(c));
        



        this.assert(diff.length==0,"problema na importação das colunas 'location','date','total_cases','new_cases','total_deaths','new_deaths'",20);

        this.assert(b2.includes("09/11/2020"),"Classifique tabela por data mais recente",20);
        this.assert(c2.includes("5590025"),"Classifique tabela por data e total de casos",20);
        this.assert(filter_brasil,"filtro 'Brasil' não encontrado",20);
        this.assert(filter_ultima_semana,"filtro 'última semana' não encontrado",20);
      

    }    
}

module.exports = Planilhas9;
