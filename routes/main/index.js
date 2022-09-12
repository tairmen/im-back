module.exports = function (app, models, auth) {
    app.get("/welcome", auth, (req, res) => {
        res.status(200).send({
            success: true,
            message: "Welcome 🙌 "
        });
    });
}