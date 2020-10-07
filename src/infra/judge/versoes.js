const DriveJudge = require('./driveJudge');

class Versoes extends DriveJudge{
    deliberate(){
        this.assert(true,"",50);
        return this.get_revisions()
            .then(revisions=>this.assert(revisions.data.revisions.length>1,"só existe uma versão do documento",50));
    }    
}

module.exports = Versoes;
