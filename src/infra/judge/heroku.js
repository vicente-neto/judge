const PuppeteerJudge = require('./puppeteerJudge');

class Heroku extends PuppeteerJudge{
    async decide(){
        let response = await this.page.goto(this.url).then((r)=>true).catch((e)=>false);
        this.report.assert(response,"não conseguimos acessar o seu sistema, verifique a url anexada e tente novamente",0);
        if(!response){
            return;
        }
        const body = await this.page.$eval('body', el => el.innerHTML);
        this.report.assert(/PHP License/.test(body),"Use a função phpinfo()",100);
        return true;
    }
}

module.exports = Heroku;
