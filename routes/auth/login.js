const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = function (app, models) {
    // Login
    app.post("/login", async (req, res) => {

        try {

            const { email, password } = req.body;

            if (!(email && password)) {
                res.status(400).send({
                    success: false,
                    message: "All input is required"
                });
            }

            const user = await models.User.findOne({ where: { email } });

            if (user && (await bcrypt.compare(password, user.password))) {

                const token = jwt.sign(
                    { user_id: user._id, email },
                    process.env.TOKEN_KEY,
                    {
                        expiresIn: "10d",
                    }
                );

                res.status(200).json({
                    success: true,
                    data: user,
                    token: token
                });
            } else {
                res.status(400).send({
                    success: false,
                    message: "Invalid Credentials"
                });
            }
        } catch (err) {
            console.log(err);
        }
    });
}