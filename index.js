const customExpress = require('./src/config/custom-express');
const app = customExpress();
app.listen(3000, function() {
    console.log(`Servidor rodando na porta 3000`);
});
