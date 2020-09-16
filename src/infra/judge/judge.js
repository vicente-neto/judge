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
    constructor(studentSubmission){
        this._grade=0;
        this._sentences=[];
        this._studentSubmission = studentSubmission;
        if(!this._inquire()){
            this.publish();
            throw new Error(this._sentences);
        }
    }
    deliberate(value){
        this._grade += value;
    }
    deliberate(assertion,text,value){
        if(assertion){
            this._grade += value;
        }else{
            this._sentences.push(text);
        }
    }

    _inquire(){
        switch(this._studentSubmission.courseWorkType){
            case Judge.courseWorkType.ASSIGNMENT:
                if(this._studentSubmission.assignmentSubmission.attachments.length==0){
                    this.deliberate(false,"não foi detectado anexo em sua resposta",0);    
                    return false;
                }
                if(!this._allAreDriveFile()){
                    this.deliberate(false,"apenas arquivos do seu Drive são permitidos",0);
                    return false;    
                }
                break;
            case Judge.courseWorkType.SHORT_ANSWER_QUESTION:
            default:
                this.deliberate(false,"courseWorkType: "+this._studentSubmission.assignmentSubmission.courseWorkType+" não verificado",0); 
                return false;   
        }
        return true;
    }
    _allAreDriveFile(){
        return !this._studentSubmission.assignmentSubmission.attachments.some(att=>!att.hasOwnProperty('driveFile'));
    }
    firstIdDriveFile(){
        return  this._studentSubmission.assignmentSubmission.attachments[0].driveFile.id;
    }
    allIdDriveFile(){
        return  this._studentSubmission.assignmentSubmission.attachments.map(att=>att.driveFile.id);
    }
    outcome(){
        console.log("grade:"+this._grade);
        Judge.classRoom.courses.courseWork.studentSubmissions.patch({
            // Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.
            courseId: this._studentSubmission.courseId,
            // Identifier of the course work.
            courseWorkId: this._studentSubmission.courseWorkId,
            // Identifier of the student .
            id: this._studentSubmission.id,
            // Mask that identifies which fields on the student submission to update. This field is required to do an update. The update fails if invalid fields are specified. The following fields may be specified by teachers: * `draft_grade` * `assigned_grade`
            updateMask: 'assignedGrade.draftGrade',
            requestBody: {
                 "assignedGrade": this._grade,
                 "draftGrade": this._grade,
              }
        }).then(res=>console.log("outcome sucess"));
    }
    
    publish(){
        Judge.classRoom.courses.courseWork.get({
            // Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.
            courseId: this._studentSubmission.courseId,
            // Identifier of the course work.
            id: this._studentSubmission.courseWorkId
          }).then(courseWork=>{
              let text = "";
              if(this._sentences){
                text = `A atividade ${courseWork.data.title} apresenta o(s) seguinte(s) problema(s):\n ${this._sentences}.
                Pontuação obtida: ${this._grade}.`;
              }else{
                text = `Julgamento da atividade ${courseWork.data.title} concluido com sucesso!`;
              }
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
              }).then(res=>console.log("publish success"))}
          );
        
    }

}

module.exports = Judge;