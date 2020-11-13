var readline = require('readline');
var fs = require('fs');

const regions = [
    'North America',
    'Asia',
    'Europe',
    'Africa',
    'South America',
    'Oceania'
];

var myInterface = readline.createInterface({
  input: fs.createReadStream('covid.txt')
});

  
// Use fs.createWriteStream() method  
// to write the file  
let writers = [
    fs.createWriteStream('NorthAmerica.txt'), 
    fs.createWriteStream('Asia.txt'), 
    fs.createWriteStream('Europe.txt'), 
    fs.createWriteStream('Africa.txt'), 
    fs.createWriteStream('SouthAmerica.txt'),  
    fs.createWriteStream('Oceania.txt')
] 
 


var lineno = 0;
myInterface.on('line', function (line) {
    lineno++;
    let res = line.match(/^\w{3},(?<region>[^,]+)/);
    if(res!=null){
        switch (res.groups.region) {
            case 'North America':
                writers[0].write(line+"\n");
                break;
            case 'Asia':
                writers[1].write(line+"\n");           
                break;    
            case 'Europe':
                writers[2].write(line+"\n");            
                break;   
            case 'Africa':
                writers[3].write(line+"\n");           
                break;   
            case 'South America':
                writers[4].write(line+"\n");         
                break;   
            case 'Oceania':
                writers[5].write(line+"\n");          
                break;       
            default:
                break;
        }
    }
  console.log('Line number ' + lineno);
});
