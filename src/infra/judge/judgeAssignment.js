const Judge = require("./judge");

class JudgeAssignment extends Judge{
    async prepare(){
        if(!await super.prepare()){
            return false;
        }
        this.report.assert(this.courseWork.isAssignment(),"Sem anexo!",0);
        return this.courseWork.isAssignment();
    }    
}

module.exports = JudgeAssignment;