const CourseWork = require("./CourseWork");

class Course{
    constructor(fields,service,userId=null){
        this.fields =  fields;
        this.service = service;
        this.courseWorks = [];
        this.userId = userId;
    }  

    async loadCourseWorks(){
        this.courseWorks = await CourseWork.findAll(this);
    }

    async process(){
        await this.loadCourseWorks();
        for(const courseWork of this.courseWorks){
            await courseWork.process();
        }
    }

    static async findAll(service,studentId=null,teacherId=null){
        let parameters = {courseStates: 'ACTIVE'};
        if(studentId){
            parameters.studentId = studentId;  
        }
        if(teacherId){
            parameters.teacherId = teacherId;  
        }
        let res = await service.courses.list(parameters);
        return res.data.courses.map(fields=> new Course(fields,service,studentId)); 
    }

    toString(){
        return this.fields.id+":"+this.courseWorks.join(",");
    }
}

module.exports = Course;