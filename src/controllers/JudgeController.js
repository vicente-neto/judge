const First = require("../infra/judge/first");
const Firstjs = require("../infra/judge/firstjs");
const Judge = require("../infra/judge/judge");

class JudgeController{
    static routers() {
        return {
            unassigned: 'unassigned.judge',
            first: 'judge.fist',
            firstjs: 'judge.firstjs',
            heroku: 'judge.heroku',
            jsdom: 'judge.jsdom',
            jsif: 'judge.jsif',
            jsrepeat: 'judge.jsrepeat'
        };
    }
    unassigned() {
        return function(courseWork) {
           
            return new Judge(courseWork);
        };
    }

    first(){
        return function(courseWork) {
            return new First(courseWork);            
        }; 
    }

    firstjs(){
        return function(courseWork) {
            return new Firstjs(courseWork);            
        }; 
    }

    heroku() {
        return function(courseWork) {
            return new Judge(courseWork);
        };
    }

    jsdom() {
        return function(courseWork) {
            return new Judge(courseWork);
        };
    }

    jsif() {
        return function(courseWork) {
            return new Judge(courseWork);
        };
    }

    jsrepeat() {
        return function(courseWork) {
            return new Judge(courseWork);
        };
    }
    
}

module.exports = JudgeController;