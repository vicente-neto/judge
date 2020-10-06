const DriveJudge = require('./driveJudge');

class Comente extends DriveJudge{
    deliberate(){
        this.assert(true,"",50);
        this.get_comments()
            .then(comments=>{console.log(comments.length);this.assert(comments.length>0,"não existe comentários no arquivo anexado",50)})
            .finally(()=>this.outcome().publish());
    }    
}

module.exports = Comente;
