const PuppeteerJudge = require('./puppeteerJudge');

class Firstjs extends PuppeteerJudge{
    async prepare(){
        if(!await super.prepare()){
            return false;
        }
        await this.page.on('dialog', async dialog => {
            await dialog.accept("Fulano");
        });
        return true;
    }
    async decide(){
        let response = await this.page.goto(this.url).then((r)=>true).catch((e)=>false);
        this.report.assert(response,"não conseguimos acessar o seu sistema, verifique a url anexada e tente novamente",0);
        if(!response){
            return;
        }
        const body = await this.page.$eval('body', el => el.innerHTML);
        this.report.assert(/Fulano/.test(body),"O nome digitado via prompt não aparece no corpo da página",100);
        return true;
    }
}

module.exports = Firstjs;
