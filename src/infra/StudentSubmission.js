const JudgeFactory = require("./judge/JudgeFactory");
const Report = require("./Report");

class StudentSubmission{
    constructor(fields,courseWork){
        this.fields =  fields;
        this.courseWork =  courseWork;
        this.service = this.courseWork.service;
        this.attachments = this.loadAttachments();
    }

    loadAttachments(){
        if(!("assignmentSubmission" in this.fields)){
            return [];
        }
        if(!("attachments" in this.fields.assignmentSubmission)){
            return [];
        }
        return this.fields.assignmentSubmission.attachments;
    }

    getAttachment(index,type,propertie=undefined){
        let attachment = this.attachments[index];
        if(!attachment || !attachment.hasOwnProperty(type)){
            return null;
        }
        if(propertie){
            return attachment[type][propertie];    
        }
        return attachment[type];
    }
    
    async process(){
        let judge = JudgeFactory.getJudge(this.courseWork,this);
        console.log("julgando studentSubmission de "+this.fields.userId);
       // console.log(this.fields);
        await judge.process();
    }

    

    static async findAll(courseWork){
        let params = {
            courseId:courseWork.fields.courseId,
            courseWorkId:courseWork.fields.id,
            states:'TURNED_IN'
        };
        if(courseWork.userId){
            params.userId = courseWork.userId;
        }
        let studentSubmissions = [];
        let response;
        while(
            response = await courseWork.service.courses.courseWork.studentSubmissions.list(params).catch((rej)=>false)
        ){
            
            if("studentSubmissions" in response.data){
                studentSubmissions = studentSubmissions.concat(response.data.studentSubmissions);
            }
            if(!("nextPageToken" in response.data)){
                break;
            }
            params.nextPageToken =  response.data.nextPageToken;
        }

        return studentSubmissions
            .filter(studentSubmission=>studentSubmission.submissionHistory.pop().hasOwnProperty('stateHistory'))
            .map(fields=>new StudentSubmission(fields,courseWork,new Report()));
    } 

    nextAttachment(type,propertie=undefined){
        let attachment = this.attachments.shift();
        if(!attachment || !attachment.hasOwnProperty(type)){
            return undefined;
        }
        if(propertie){
            return attachment[type][propertie];    
        }
        return attachment[type];
    }

    async score(grade){
        let params = {
            courseId: this.fields.courseId,
            courseWorkId: this.fields.courseWorkId,
            id: this.fields.id,
            updateMask: 'assignedGrade,draftGrade',
            requestBody: {
                "assignedGrade": grade,
                "draftGrade": grade,
            }
        };
        await this.service.courses.courseWork.studentSubmissions.patch(params)
            .catch((rej)=>console.log(rej));
    }

    
    async publish(msn){
        await this.service.courses.announcements.create({
            courseId: this.fields.courseId,
            requestBody: {
                 "assigneeMode": "INDIVIDUAL_STUDENTS",
                 "individualStudentsOptions": {"studentIds": [
                    this.fields.userId
                  ]}
                 ,
                 "text": msn,
            },
          }).catch((rej)=>console.log(rej));         
    }


    toString(){
        return this.fields.id;
    }
}

module.exports = StudentSubmission;