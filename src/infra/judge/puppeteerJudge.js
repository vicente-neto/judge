const puppeteer = require('puppeteer');
const JudgeAssignment = require('./judgeAssignment');
const JudgeLink = require('./JudgeLink');

class PuppeteerJudge extends JudgeLink{
    async prepare(){ 
        if(!await super.prepare()){
            return false;
        }
        this.browser = await puppeteer.launch().catch((e)=>{console.log(e);return null;});
        if(!this.browser){
            this.report.assert(false,"problema na simulação de navegação!Reporte ao professor!",0);
            return false;
        }
        this.page = await this.browser.pages().then((pages)=>pages[0]).catch((e)=>null);
        if(!this.page){   
            this.report.assert(false,"problema ao carregar a página!Reporte ao professor!",0); 
            return false;
        }
        await this.page.setDefaultTimeout(5000); 
        return true;
    }
    async close(){
        await super.close();
        if(this.browser){
            await this.browser.close();
        }
    }
}

module.exports = PuppeteerJudge;
