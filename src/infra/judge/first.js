const PuppeteerJudge = require('./puppeteerJudge');

class First extends PuppeteerJudge{
    async decide(){
        let response = await this.page.goto(this.url).then((r)=>true).catch((e)=>false);
        this.report.assert(response,"não conseguimos acessar o seu sistema, verifique a url anexada e tente novamente",0);
        if(response){
            this.report.assert(/github\.io/.test(this.url),"sistema deve usar padrão de url do github pages",100);
        }
        return true;
    }
}

module.exports = First;
