const GoogleApi = require('../google-api');
class Judge{
    static courseWorkType = {
        ASSIGNMENT: "ASSIGNMENT",
        SHORT_ANSWER_QUESTION: "SHORT_ANSWER_QUESTION"
    }
    static classRoom = GoogleApi.getclassroom();

    _grade;
    _studentSubmission;
    _sentences;
    init(studentSubmission){
        this._grade=0;
        this._sentences=[];
        this._studentSubmission = studentSubmission;
        if(!this._inquire()){
            throw new Error(this._sentences);
        }
    };
    assert(assertion,text,value){
        if(assertion){
            this._grade += value;
            return true;
        }else{
            this._sentences.push(text);
            return false;
        }
    }

    _inquire(){
        switch(this._studentSubmission.courseWorkType){
            case Judge.courseWorkType.ASSIGNMENT:
                if(!this._hasAttachments()){
                    this.assert(false,"não foi detectado anexo em sua resposta",0);  
                    return false;
                }
                if(!this._allAreDriveFile()){
                    this.assert(false,"apenas arquivos do seu Drive são permitidos",0);
                    return false;    
                }
                break;
            case Judge.courseWorkType.SHORT_ANSWER_QUESTION:
            default:
                this.assert(false,"courseWorkType: "+this._studentSubmission.assignmentSubmission.courseWorkType+" não verificado",0); 
                return false;   
        }
        return true;
    }
    _hasAttachments(){
        return this._studentSubmission.assignmentSubmission.attachments instanceof Array
    }
    _allAreDriveFile(){
        return !this._studentSubmission.assignmentSubmission.attachments.some(att=>!(att.hasOwnProperty('driveFile')||att.hasOwnProperty('form')));
    }
    firstIdDriveFile(){
        return  this._studentSubmission.assignmentSubmission.attachments[0].driveFile.id;
    }
    allIdDriveFile(){
        return  this._studentSubmission.assignmentSubmission.attachments;
    }
    async allSpreadsheets(){
        let spreadsheets = [];
        let attachements = this._studentSubmission.assignmentSubmission.attachments.filter((att)=>att.hasOwnProperty("driveFile"));
        for(let i=0;i<attachements.length;i++){
            let spreadsheet = await GoogleApi.getdrive().files.get({fileId:attachements[i].driveFile.id,fields:"mimeType"}).then(ss=>ss.data.mimeType); 
            spreadsheets.push(spreadsheet);
        }
       
        return spreadsheets;

    }
    outcome(patch){


        if(patch){
            Judge.classRoom.courses.courseWork.studentSubmissions.patch({
                // Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.
                courseId: this._studentSubmission.courseId,
                // Identifier of the course work.
                courseWorkId: this._studentSubmission.courseWorkId,
                // Identifier of the student .
                id: this._studentSubmission.id,
                // Mask that identifies which fields on the student submission to update. This field is required to do an update. The update fails if invalid fields are specified. The following fields may be specified by teachers: * `draft_grade` * `assigned_grade`
                updateMask: 'assignedGrade,draftGrade',
                requestBody: {
                    "assignedGrade": this._grade,
                    "draftGrade": this._grade,
                }
            }).then(res=>{console.log(`nota atribuida`)}).catch((rej)=>console.log(rej));
        }
        return this;
    }
    
    publish(announcement){
        Judge.classRoom.courses.courseWork.get({
            // Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.
            courseId: this._studentSubmission.courseId,
            // Identifier of the course work.
            id: this._studentSubmission.courseWorkId
          }).then(courseWork=>{
              let text = "";
              if(this._sentences.length>0){
                text = `
                    A atividade ${courseWork.data.title} apresenta o(s) seguinte(s) problema(s):
                    ${this._sentences}.
                    Pontuação obtida: ${this._grade}.`;
              }else{
                text = `Julgamento da atividade ${courseWork.data.title} concluido com sucesso!`;
              }
              console.log(text);
              GoogleApi.studentByUserId(this._studentSubmission.courseId,this._studentSubmission.userId)
              .then(profile=>console.log(`corrected student(${profile.emailAddress}) submission by courseWork(${courseWork.data.title}. Grade:${this._grade})`));
              if(announcement){
                Judge.classRoom.courses.announcements.create({
                    // Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.
                    courseId: this._studentSubmission.courseId,
                    requestBody: {
                         "assigneeMode": "INDIVIDUAL_STUDENTS",
                         "individualStudentsOptions": {"studentIds": [
                            this._studentSubmission.userId
                          ]}
                         ,
                         "text": text,
                    },
                  }).catch((rej)=>console.log(rej));
              }
            
            });
        return this;          
    }

}

module.exports = Judge;