const Report = require("../Report");
const First = require("./first");
const Firstjs = require("./firstjs");
const Heroku = require("./heroku");
const Jsdom = require("./jsdom");
const Jsif = require("./jsif");
const Jsrepeat = require("./jsrepeat");
const Judge = require("./judge");

class JudgeFactory{
    static getJudge(courseWork,studentSubmission){
        let description = courseWork.fields.description;
        let type = "judge";
        if(description && /judge(\.[a-zA-Z]+)+/.test(description)){
            type = description.match(/judge(\.[a-zA-Z]+)+/g)[0];
        }
        switch (type) {
            case "judge.first":
                return new First(courseWork,studentSubmission,new Report());
                break;
            case "judge.firstjs":
                return new Firstjs(courseWork,studentSubmission,new Report());
                break;
            case "judge.heroku":
                return new Heroku(courseWork,studentSubmission,new Report());
                break;
            case "judge.jsdom":
                return new Jsdom(courseWork,studentSubmission,new Report());
                break;
            case "judge.jsif":
                return new Jsif(courseWork,studentSubmission,new Report());
                break;
            case "judge.jsrepeat":
                return new Jsrepeat(courseWork,studentSubmission,new Report());
                break;
            default:
                return new Judge(courseWork,studentSubmission,new Report());
                break;
        }
        return;
    }
}

module.exports = JudgeFactory;