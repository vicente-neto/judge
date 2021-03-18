const Application = require("./Application");
const {google} = require('googleapis');
const Google = require('../infra/Google');
const oauth2 = require("../config/oauth2client");
const ClassRoom = require("../infra/ClassRoom");
const Course = require("../infra/Course");
class JudgeApp extends Application{
    
    routing(courseWork){
        let description = courseWork.fields.description;
        if(!description || !/judge(\.[a-zA-Z]+)+/.test(description)){
            return "unassigned.judge";
        }
        return description.match(/judge(\.[a-zA-Z]+)+/g)[0];
    }
    async run(params={}){
        let service = google.classroom({version: "v1",auth:oauth2});
        let courses = await Course.findAll(service,"vicnet@gmail.com","helper.classroom@gmail.com");
        for(const course of courses){
            console.log("processando "+course.fields.name);
            await course.process();
        }
        return;
/*
        let googleApiParams = {};
        if(params.hasOwnProperty("userId")){
            googleApiParams.userId = params.userId;
        }
        let courses = await GoogleApi.coursesByClassroom(googleApiParams);
        
        for(const course of courses){
            for(const courseWork of course.courseWorks){
                let router = this.routing(courseWork.details);
                if(this._routers.has(router)){
                    let judge = this._routers.get(router)(courseWork);
                    await judge.deliberate();
                }
            }
        }

 */      
    }
}
module.exports = JudgeApp;