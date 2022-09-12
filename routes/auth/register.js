const bcrypt = require("bcryptjs");
const make_code = require("../../plugins/make_code");
let nodemailer = require('nodemailer');

let mail = nodemailer.createTransport({
    service: process.env.EMAIL_TYPE,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    }
});

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

            let code = make_code(6);

            await models.User.update({ token: code }, {
                where: {
                    email
                }
            });

            let mailOptions = {
                from: 'abduraimovtair@gmail.com',
                to: email,
                subject: 'Finish your registration',
                text: `Code: ${code}`
            };

            mail.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });

            encryptedPassword = await bcrypt.hash(password, 10);

            const user = await models.User.create({
                phone,
                email: email.toLowerCase(),
                password: encryptedPassword,
                token: code
            });

            res.status(201).json({
                success: true,
                message: "Code sent to your email",
            });
        } catch (err) {
            console.log(err);
        }
    });
}