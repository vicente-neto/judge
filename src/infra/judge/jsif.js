const PuppeteerJudge = require('./puppeteerJudge');

class Jsif extends PuppeteerJudge{
    async decide(){
        let response = await this.page.goto(this.url).then((r)=>true).catch((e)=>false);
        this.report.assert(response,"não conseguimos acessar o seu sistema, verifique a url anexada e tente novamente",0);
        if(!response){
            return;
        }
        const textBefore = await this.page.$eval('p', e => e.innerHTML);
        const classBodyBefore = await this.page.$eval('body', el => el.className);
        
        await this.page.click('p');
        const textAfter = await this.page.$eval('p', e => e.innerHTML);
        const classBodyAfter = await this.page.$eval('body', el => el.className);
        this.report.assert(classBodyBefore!=classBodyAfter,"O class do body tem que ser alterado no clique do paragrafo",50);
        this.report.assert(textBefore!=textAfter,"O texto do paragrafo tem que ser alterado no clique",50); 
        return true;
    }
}

module.exports = Jsif;
