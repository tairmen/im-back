const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = function (app, models) {
    app.post("/reset_password", async (req, res) => {

        try {

            const { password, code } = req.body;

            if (!password || !code) {
                res.status(400).send({
                    success: false,
                    message: "All input is required"
                });
            }

            const user = await models.User.findOne({ where: { token: code } });
            if (user && user.token == code) {
                const token = jwt.sign(
                    { user_id: user.id, email: user.email },
                    process.env.TOKEN_KEY,
                    {
                        expiresIn: "10d",
                    }
                );

                encryptedPassword = await bcrypt.hash(password, 10);

                const new_user = await models.User.update({ token: null, password: encryptedPassword }, {
                    where: {
                        email: user.email
                    }
                });

                res.status(200).json({
                    success: true,
                    data: new_user,
                    token: token
                });
            } else {
                res.status(200).send({
                    success: false,
                    message: "Invalid code"
                });
            }

        } catch (err) {
            console.log(err);
        }
    });
}