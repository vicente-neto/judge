const Course = require("./Course");
class Classroom{
    constructor(api,auth){
        this.service = api.classroom({version: "v1",auth:auth});
    }
}
module.exports = Classroom;