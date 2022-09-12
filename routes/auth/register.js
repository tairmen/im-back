const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = function (app, models) {
    // Register
    app.post("/register", async (req, res) => {

        try {

            const { phone, email, password } = req.body;

            if (!(email && password && phone)) {
                res.status(400).send({
                    success: false,
                    message: "All input is required"
                });
            }

            const oldUser = await models.User.findOne({ where: { email } });

            if (oldUser) {
                return res.status(409).send({
                    success: false,
                    message: "User Already Exist. Please Login"
                });
            }

            encryptedPassword = await bcrypt.hash(password, 10);

            const user = await models.User.create({
                phone,
                email: email.toLowerCase(),
                password: encryptedPassword,
            });

            const token = jwt.sign(
                { user_id: user._id, email },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "10d",
                }
            );

            res.status(201).json({
                success: true,
                data: user,
                token: token
            });
        } catch (err) {
            console.log(err);
        }
    });
}