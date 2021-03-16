const Judge = require("./judge");

class JudgeAssignment extends Judge{
    async prepare(){
        if(!await super.prepare()){
            return false;
        }
        return this.courseWork.isAssignment();
    }    
}

module.exports = JudgeAssignment;