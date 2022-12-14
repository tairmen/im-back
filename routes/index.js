const auth = require("../middleware/auth");
let login = require("./auth/login");
let register = require("./auth/register");
let email_send = require("./auth/email_send");
let reset_password = require("./auth/reset_password");
let main = require("./main/index");

module.exports = function(app, models) {
    login(app, models);
    register(app, models);
    email_send(app, models);
    reset_password(app, models);
    main(app, models, auth);
}