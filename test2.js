const Googleapi = require("./src/infra/google-api");

const service = Googleapi.getclassroom();

service.courses.courseWork.studentSubmissions.modifyAttachments