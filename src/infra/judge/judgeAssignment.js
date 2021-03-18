const Judge = require("./judge");

class JudgeAssignment extends Judge{
    async prepare(){
        if(!await super.prepare()){
            return false;
        }
        this.report.assert(this.courseWork.isAssignment(),"A atividade precisa de um anexo como resposta!",0);
        return this.courseWork.isAssignment();
    }    
}

module.exports = JudgeAssignment;