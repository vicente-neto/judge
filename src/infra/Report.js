class Report{
    constructor(){
        this.grade=0;
        this.posts=[];
    }
    assert(assertion,post,point){
        if(assertion){
            this.grade += point;
            return true;
        }else{
            this.posts.push(post);
            return false;
        }
    }
    toString(){
        if(this.posts.length==0){
            return "Avaliação completa e bem sucedida!\n";
        }
        return `Foram detectados os seguintes problemas:\n${this.posts.join("\n")}.\n`; 
    }
}

module.exports = Report;

