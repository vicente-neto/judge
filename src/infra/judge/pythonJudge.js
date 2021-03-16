const DriveJudge = require('./driveJudge');
const fs = require('fs');
const pys = [
    {
        code:
`
try:
    oimundo()
except:
    print('')
`
        ,
        out:'Oi, mundo!',
        msg:'problema na chamada de oimundo'
    },
    {
        code:
`
try:
    help(oimundo)
except:
    print('')
`,
        out:'Um simples Oi, mundo!',
        msg:'problema no help de oimundo'
    },
    {
        code:
`
try:
    oifulano("ana")
except:
    print('')
`,
        out:'Oi, ana!',
        msg:'problema na chamada de oifulano'
    },
    {
        code:
`
try:
    oifulano()
except:
    print('')
`,
        out:'Oi, fulano!',
        msg:'problema na chamada de oifulano'
    },
    {
        code:
`
try:
    oifulanos("ana", "bia", "carol")
except:
    print('')
`,
        out:
`Oi, carol!`,
        msg:'problema na chamada de oifulanos'
    },
    {
        code:
`
try:
    oilista(["ana", "bia", "carol"])
except:
    print('')
`,
        out:
`Oi, carol!`,
        msg:'problema na chamada de oilista'
    },
    {
        code:
`
try:
    lista658 = ["ana", "bia", "carol"]
    oilista(lista658)
    print(len(lista658))
except:
    print('')
`,
        out:'3',
        msg:'problema em esvaziar a lista na chamada oilista'
    },
    {
        code:
`
try:
    oimundo()
    print(qtois())
except:
    print('')
`,
        out:'1',
        msg:'problema na chamada de qtois'
    },
    {
        code:
`
try:
    oifulanos("ana", "ana", "bia", "carol")
    print(len(cumprimentados()))
except:
    print('')
`,
        out:'3',
        msg:'problema na chamada de cumprimentados com nomes repetidos'
    },
    {
        code:
`
try:
    oifulanos("ana", "bia", "carol")
    print(len(cumprimentados()))
except:
    print('')
`,
        out:'3',
        msg:'problema na chamada de cumprimentados'
    }
]
class PythonJudge extends DriveJudge{
    constructor(path){
        super();
       // this._pathInput = "./python/input/"+path;
       // this._pathOutput = "./python/output/"+path; 
    }
    deliberate(){
        return this.get_content().then((content)=>{
            for(let py of pys){
                fs.writeFileSync('./python/student-submission.py',content+"\n"+py.code);
                let cmd = `python python/student-submission.py`;
                try {
                    const exec = require('child_process').execSync;
                    let out = exec(cmd,{timeout: 1000,killSignal: 'SIGKILL'}).toString();
                    this.assert(out.includes(py.out),py.msg,10);
                } catch (error) {
                    let typeError;
                    if(/(?<typeError>(ETIMEDOUT)|(EOFError)|(SyntaxError)|(TypeError)|(NameError))/.test(error.message)){
                        console.log(error.message);
                        typeError = error.message.match(/(?<typeError>(ETIMEDOUT)|(EOFError)|(SyntaxError)|(TypeError)|(NameError))/).groups.typeError;
                        
                    }else{
                        typeError=undefined;
                    }
                    switch (typeError) {
                        case "ETIMEDOUT":
                            this.assert(false,`teste excedeu o limite de tempo de execução`,0);
                            break;
                        case "EOFError":
                            this.assert(false,`código submetido solicita mais dados que o solicitado pelo problema`,0);
                            break;
                        case "SyntaxError":
                        case "TypeError":
                        case "NameError":
                            let groups = error.message.match(/line (?<line>\d+)[^\n]*\n(?<code>([^\n]*\n)*)(?<error>[^\n]*\n)$/).groups; 
                            this.assert(false,`${groups.error}\n(L${groups.line}):${groups.code}.`,0);                           
                            break;
                        default:
                            this.assert(false,`${error.message}`,0);
                            break;
                    }
                    break;
                }
            }
        });
        
    }

}

module.exports = PythonJudge;
