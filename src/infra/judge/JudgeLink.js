const Judge = require("./judge");
const JudgeAssignment = require("./judgeAssignment");

class JudgeLink extends JudgeAssignment{
    async prepare(){
        if(!await super.prepare()){
            return false;
        }
        
        this.url = this.studentSubmission.getAttachment(0,"link","url");    
        return  this.url!==null;
    }
}

module.exports = JudgeLink;