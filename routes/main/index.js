let payment = require("./payment");
let callback = require("./callback");

module.exports = function (app, models, auth) {
    app.get("/current", auth, async (req, res) => {
        console.log(req.user);
        const user = await models.User.findOne({ where: { email: req.user.email } });
        res.status(200).send({
            success: true,
            message: "Welcome 🙌 ",
            data: user
        });
    });
    payment(app, models, auth);
    callback(app, models, auth);
}