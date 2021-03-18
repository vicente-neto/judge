const App = require("./src/app/JudgeApp");
const consign = require('consign');

let app = new App();

consign()
.include('src/routers')
.into(app);

//app.listen();
app.run();

