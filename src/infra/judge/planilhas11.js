const DriveJudge = require('./driveJudge');
const GoogleApi = require('../google-api');

class Planilhas11 extends DriveJudge{
    async deliberate(){
        let formulario = await GoogleApi.getPropertiesSheet(this.firstIdDriveFile(),"gráfico");
        
 
        let tabela = await GoogleApi.getPropertiesSheet(this.firstIdDriveFile(),"tabela!a1");

      
        let tests = [];

        try {
            tests.push(
                formulario.data.sheets[0].hasOwnProperty("charts")
                );  
        } catch (error) {
            tests.push(false); 
        }
        try {
            tests.push(
                formulario.data.sheets[0].charts[0].spec.basicChart.chartType
                ==
                "COLUMN"
                );  
        } catch (error) {
            tests.push(false); 
        }
        try {
            tests.push(
                formulario.data.sheets[0].charts[0].spec.basicChart.legendPosition
                ==
                "TOP_LEGEND"
                );  
        } catch (error) {
            tests.push(false); 
        }
        try {
            tests.push(
                formulario.data.sheets[0].charts[0].spec.hiddenDimensionStrategy
                ==
                "SKIP_HIDDEN_ROWS_AND_COLUMNS"
                );  
        } catch (error) {
            tests.push(false); 
        }
        try {
            tests.push(
                formulario.data.sheets[0].charts[0].spec.basicChart.domains[0].domain.sourceRange.sources[0].endColumnIndex
                ==
                2
                );  
        } catch (error) {
            tests.push(false); 
        }
        try {
            tests.push(
                formulario.data.sheets[0].charts[0].spec.basicChart.series[0].series.sourceRange.sources[0].endColumnIndex
                ==
                4
                );  
        } catch (error) {
            tests.push(false); 
        }
        try {
            tests.push(
                tabela.data.sheets[0].data[0].rowData[0].values[0].hasOwnProperty("pivotTable")
                );  
        } catch (error) {
            tests.push(false); 
        }
        try {
            tests.push(
                tabela.data.sheets[0].data[0].rowData[0].values[0].pivotTable.rows[0].sourceColumnOffset
                ==
                1
                );  
        } catch (error) {
            tests.push(false); 
        }
        try {
            tests.push(
                tabela.data.sheets[0].data[0].rowData[0].values[0].pivotTable.columns[0].sourceColumnOffset
                ==
                0
                );  
        } catch (error) {
            tests.push(false); 
        }
        try {
            tests.push(
                tabela.data.sheets[0].data[0].rowData[0].values[0].pivotTable.values[0].sourceColumnOffset
                ==
                5
                );  
        } catch (error) {
            tests.push(false); 
        }
        try {
            tests.push(
                tabela.data.sheets[0].data[0].rowData[0].values[0].pivotTable.hasOwnProperty("filterSpecs")
                );  
        } catch (error) {
            tests.push(false); 
        }

        if(this.assert(tests[0],"gráfico não foi encontrado!",5)){
            this.assert(tests[1],"use o gráfico de coluna!",10);
            this.assert(tests[2],"legenda deve ficar no topo do gráfico",10);
            this.assert(tests[3],"valores ocultos não devem aparecer no gráfico",10);
            this.assert(tests[4],"eixo x deve ser relacionado a coluna de data",10);
            this.assert(tests[5],"eixo y deve ser relacionado a coluna de novos casos",10);
        }

        if(this.assert(tests[6],"tabela dinâmica não foi encontrada",5)){
            this.assert(tests[7],"a linha da tabela dinâmica deve ser relacionada a data",10);
            this.assert(tests[8],"a coluna da tabela dinâmica deve ser relacionada a localização",10);
            this.assert(tests[9],"os valores da tabela dinâmica deve ser relacionados as novas mortes",10);
            this.assert(tests[10],"linhas da tabela dinâmica sem valores maiores que zero não devem aparecer",10);
        }

       

    }    
}

module.exports = Planilhas11;
