const PuppeteerJudge = require('./puppeteerJudge');

class Jsdom extends PuppeteerJudge{
    async decide(){
        let response = await this.page.goto(this.url).then((r)=>true).catch((e)=>false);
        this.report.assert(response,"não conseguimos acessar o seu sistema, verifique a url anexada e tente novamente",0);
        if(!response){
            return;
        }
        await this.page.click('#bt-a');
        await this.page.click('#bt-b');
        await this.page.click('#bt-c');
        const body = await this.page.$eval('body', el => el.innerHTML);
        this.report.assert(/35/.test(body),"O valor não corresponde a soma dos itens clicados",100);
        return true;
    }
}

module.exports = Jsdom;
