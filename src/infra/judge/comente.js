const DriveJudge = require('./driveJudge');

class Comente extends DriveJudge{
    deliberate(){
        this.assert(true,"",50);
        return this.get_comments()
            .then(comments=>{this.assert(comments.length>0,"não existe comentários no arquivo anexado",50)});
    }    
}

module.exports = Comente;
