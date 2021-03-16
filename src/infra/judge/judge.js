const GoogleApi = require('../google-api');
class Judge{

    constructor(courseWork,studentSubmission,report) {
        this.courseWork = courseWork;
        this.studentSubmission = studentSubmission;
        this.report = report; 
    }

    async process(){
        try {
            if(!await this.prepare()){
                return;
            }
            if(await this.decide()){
                console.log(this.courseWork.fields.title);
                console.log(this.studentSubmission.fields.userId);
                
               
            }
        } catch (error) {
            console.log(error);
        } finally{
            console.log(this.report);
            await this.studentSubmission.score(this.report.grade);
            let msn = `${this.courseWork.fields.title}: ${this.report}`;
            await this.studentSubmission.publish(msn);
            await this.close();
        }
        
       
    }

    async prepare(){
        return true;
    }

    async decide(){
        return false;
    }

    async close(){

    }

   
    
    

}

module.exports = Judge;