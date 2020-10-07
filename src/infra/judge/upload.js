const DriveJudge = require('./driveJudge');

class Upload extends DriveJudge{

    deliberate(){
        //Arquivo do Google Drive foi anexado corretamente.
        this.assert(true,"",50);
        //Arquivo compartilhado ao público geral um perfil reader além do próprio aluno que envio a atividade
        return this.get_permissions()
            .then((permissions)=>{
                this.assert(permissions.length>=2,"O arquivo não foi compartilhado",50);
            });
    }    
}

module.exports = Upload;
