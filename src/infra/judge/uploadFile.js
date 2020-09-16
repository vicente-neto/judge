const DriveJudge = require('./drivejudge');

class UploadFile extends DriveJudge{
    constructor(studentSubmission){
        super(studentSubmission);
    }
    async deliberate(){
        let fields = await this.getFields("permissions");
        let permissions = fields.permissions;
        //Arquivo do Google Drive foi anexado corretamente.
        super.deliberate(50);
        //Arquivo compartilhado ao público geral um perfil reader além do próprio aluno que envio a atividade
        super.deliberate(permissions.filter((permission)=>permission.role=="reader").length>=2,"O arquivo não foi compartilhado",50);
        this.outcome();
        this.publish();
    }    
}

module.exports = UploadFile;
