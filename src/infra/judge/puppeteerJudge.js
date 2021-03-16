const puppeteer = require('puppeteer');
const JudgeAssignment = require('./judgeAssignment');
const JudgeLink = require('./JudgeLink');

class PuppeteerJudge extends JudgeLink{
    async prepare(){ 
        if(!await super.prepare()){
            return false;
        }
        this.browser = await puppeteer.launch().catch((e)=>null);
        
        if(!this.browser){
            return false;
        }
        this.page = await this.browser.pages().then((pages)=>pages[0]).catch((e)=>null);
        if(!this.page){    
            return false;
        }
        await this.page.setDefaultTimeout(5000); 
        return true;
    }
    async close(){
        await super.close();
        await this.browser.close();
        
       
    }
}

module.exports = PuppeteerJudge;
