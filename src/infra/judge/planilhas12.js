const DriveJudge = require('./driveJudge');
const GoogleApi = require('../google-api');

class Planilhas12 extends DriveJudge{
    async deliberate(){
        let b2,b3,b4,b5,b6;
                     
        try {
            await GoogleApi.batchUpdateSheet(
                this.firstIdDriveFile(),
                [
                    {
                        "range": "'América do Sul'!D2",
                        "majorDimension": "ROWS",
                        "values": [ [1001] ]
                    }, 
                    {
                        "range": "'América do Sul'!F11",
                        "majorDimension": "ROWS",
                        "values": [ [1] ]
                    },
                    {
                        "range": "'América do Sul'!D11",
                        "majorDimension": "ROWS",
                        "values": [ [100000] ]
                    }
                ]
            );
        } catch (error) {

            this.assert(false,"verifique se existe a página 'América do Sul'",0);
            return;
        }



        try {

            let data = await GoogleApi.batchGetSheet(this.firstIdDriveFile(),[
                "'perguntas'!B2",
                "'perguntas'!B3",
                "'perguntas'!B4",
                "'perguntas'!B5",
                "'perguntas'!B6"
            ]);

            [b2,b3,b4,b5,b6] = data.valueRanges.map((range)=>range.hasOwnProperty("values")?range.values[0][0]:""); 
        
          console.log( [b2,b3,b4,b5,b6]);
        } catch (error) {

            this.assert(false,"verifique se existe a página 'perguntas'",0);
            return;
        }

  


        try {
            await GoogleApi.batchUpdateSheet(
                this.firstIdDriveFile(),
                [
                    {
                        "range": "'América do Sul'!D2",
                        "majorDimension": "ROWS",
                        "values": [ [0] ]
                    }, 
                    {
                        "range": "'América do Sul'!F11",
                        "majorDimension": "ROWS",
                        "values": [ [0] ]
                    },
                    {
                        "range": "'América do Sul'!D11",
                        "majorDimension": "ROWS",
                        "values": [ [5] ]
                    }
                ]
            );
        } catch (error) {

            this.assert(false,"verifique se existe a página 'América do Sul'",0);
            return;
        }

        

      


        let tests = [];

        tests.push(/218/i.test(b2));
        tests.push(/10/i.test(b3));
        tests.push(/10/i.test(b4));
        tests.push(/Suriname/i.test(b5));
        tests.push(/09\/11\/2020/i.test(b6));

        this.assert(tests.shift(),"problema na 1° pergunta!",20);
        this.assert(tests.shift(),"problema na 2° pergunta!",20);
        this.assert(tests.shift(),"problema na 3° pergunta!",20);
        this.assert(tests.shift(),"problema na 4° pergunta!",20);
        this.assert(tests.shift(),"problema na 5° pergunta!",20);
       
        
       

    }    
}

module.exports = Planilhas12;
