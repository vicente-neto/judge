const PuppeteerJudge = require('./puppeteerJudge');

class Jsrepeat extends PuppeteerJudge{
    async decide(){
        let response = await this.page.goto(this.url).then((r)=>true).catch((e)=>false);
        this.report.assert(response,"não conseguimos acessar o seu sistema, verifique a url anexada e tente novamente",0);
        if(!response){
            return;
        }
        await await this.page.waitForResponse('https://polar-taiga-94967.herokuapp.com/');
        const number = await this.page.$eval('#number', e => e.innerHTML);
        const children = await this.page.$eval('#lista', e => e.children.length);
        this.report.assert(number==children,"O número de itens na lista deve ser igual ao número recebido!",100); 
        return true;
    }
}

module.exports = Jsrepeat;
