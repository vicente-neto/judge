class Request{
    constructor(params){
        try {
            
            this.message = message;
            this.data = message.content.match(/^elza (?<controller>\w+):(?<command>\w+)( (?<flags>.*))?$/).groups;
            if(this.data.flags)
                this.data.flags = this.data.flags
                    .match(/(--(\w+)[^-]*)/g).map((flag)=>{
                        let groups = flag.match(/^--(?<title>\w+)( (?<list>.*))?/).groups;
                        groups.list = groups.list.split(",").map((e)=>e.match(":")?e.split(":").map(e=>e.replace(/"/g,"").trim()):e.replace(/"/g,"").trim());
                        return groups});
        } catch (error) {
            throw new Error(error);  
        }
    }
    router(){
        return this.data.controller+":"+this.data.command;
    }
}

module.exports = Request;