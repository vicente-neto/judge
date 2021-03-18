const JudgeFactory = require("./judge/JudgeFactory");
const StudentSubmission = require("./StudentSubmission");

class CourseWork{
    constructor(fields,course){
        this.course =  course;
        this.fields = fields;
        this.service =  course.service; 
        this.studentSubmissions = [];
        this.userId = course.userId;
    } 

    isAssignment(){
        return this.fields.workType=="ASSIGNMENT";
    }
    
    

    async process(){
        console.log("processando courseWork: "+this.fields.title);
        await this.loadStudentSubmissions();
        for(const studentSubmission of this.studentSubmissions){
            
            await studentSubmission.process();
        }
    }

    async loadStudentSubmissions(){
        this.studentSubmissions = await StudentSubmission.findAll(this);
    }

    static async findAll(course){
        let params = {courseId:course.fields.id};
        let courseWorks = [];
        let response;
        while(
            response = await course.service.courses.courseWork.list(params).catch(reject=>false)
        ){
            if("courseWork" in response.data){
                courseWorks = courseWorks.concat(response.data.courseWork);
            }
            if(!("nextPageToken" in response.data)){
                break;
            }
            params.nextPageToken =  response.data.nextPageToken;
        }
        courseWorks = courseWorks.filter(courseWork=>courseWork.hasOwnProperty("associatedWithDeveloper"));

       // courseWorks = courseWorks.filter(courseWork=>courseWork.title=="jsrepeat");

        courseWorks = courseWorks.map(courseWork=>new CourseWork(courseWork,course));

        return courseWorks;
    } 
    toString(){
        return this.fields.id+":"+this.studentSubmissions.join(",");
    }
}

module.exports = CourseWork;