const GoogleController = require('../controllers/google-controller');
const googleController = new GoogleController();

module.exports = (app) => {
    const routersGoogle = GoogleController.routers();
    
    app.get(routersGoogle.findCourse, googleController.findCourse());
    app.get(routersGoogle.test, googleController.test());
    app.get(routersGoogle.findCourseWork, googleController.findCourseWork());
    app.post(routersGoogle.createCourseWork, googleController.createCourseWork());
    app.post(routersGoogle.judgeCourseWork, googleController.judgeCourseWork());

};