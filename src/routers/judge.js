const JudgeController = require('../controllers/JudgeController');
const judgeController = new JudgeController();

module.exports = (app) => {
    const routers =JudgeController.routers();
    app.add(routers.unassigned,  judgeController.unassigned());
    app.add(routers.first,  judgeController.first());
    app.add(routers.firstjs,  judgeController.firstjs());
    app.add(routers.heroku,  judgeController.heroku());
    app.add(routers.jsdom,  judgeController.jsdom());
    app.add(routers.jsif,  judgeController.jsif());
    app.add(routers.jsrepeat,  judgeController.jsrepeat());
};