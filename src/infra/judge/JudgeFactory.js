const First = require("./first");
const Firstjs = require("./firstjs");
const Heroku = require("./heroku");
const Jsdom = require("./jsdom");
const Jsif = require("./jsif");
const Jsrepeat = require("./jsrepeat");
const Judge = require("./judge");

class JudgeFactory{
    static getJudge(studentSubmission){
        let description = studentSubmission.courseWork.fields.description;
        let type = "judge";
        if(description && /judge(\.[a-zA-Z]+)+/.test(description)){
            type = description.match(/judge(\.[a-zA-Z]+)+/g)[0];
        }
        switch (type) {
            case "judge.first":
                return new First(studentSubmission);
                break;
            case "judge.firstjs":
                return new Firstjs(studentSubmission);
                break;
            case "judge.heroku":
                return new Heroku(studentSubmission);
                break;
            case "judge.jsdom":
                return new Jsdom(studentSubmission);
                break;
            case "judge.jsif":
                return new Jsif(studentSubmission);
                break;
            case "judge.jsrepeat":
                return new Jsrepeat(studentSubmission);
                break;
            default:
                return new Judge(studentSubmission);
                break;
        }
        return;
    }
}

module.exports = JudgeFactory;