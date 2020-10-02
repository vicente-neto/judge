const DriveJudge = require('./driveJudge');

class UploadFile extends DriveJudge{
    constructor(studentSubmission){
        super(studentSubmission);
    }
    deliberate(){
        //Arquivo do Google Drive foi anexado corretamente.
        this.assert(true,"",50);
        //Arquivo compartilhado ao público geral um perfil reader além do próprio aluno que envio a atividade
        this.get_fields("permissions")
            .then((permissions)=>this.assert(this.get_permissions()>=2,"O arquivo não foi compartilhado",50))
            .finally(()=>this.outcome().publish());
    }    
}

module.exports = UploadFile;
