const Judge = require("./judge");
const JudgeAssignment = require("./judgeAssignment");

class JudgeLink extends JudgeAssignment{
    async prepare(){
        if(!await super.prepare()){
            return false;
        }
       
        this.url = this.studentSubmission.getAttachment(0,"link","url");    
        this.report.assert(this.url!==null,"O anexo deve ser uma url!",0);
        return  this.url!==null;
    }
}

module.exports = JudgeLink;