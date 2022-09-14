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
    app.post("/email_send", async (req, res) => {

        try {

            const { email } = req.body;

            if (!email) {
                res.status(400).send({
                    success: false,
                    message: "All input is required"
                });
            }

            const user = await models.User.findOne({ where: { email } });
            if (user) {
                let code = make_code(6);

                await models.User.update({ token: code }, {
                    where: {
                        email
                    }
                });

                let mailOptions = {
                    from: 'abduraimovtair@gmail.com',
                    to: email,
                    subject: 'Confirm you email',
                    text: `Code: ${code}`
                };

                mail.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });

                res.status(201).json({
                    success: true,
                    message: "Code sent to your email",
                });
            } else {
                return res.status(200).send({
                    success: false,
                    message: "User not exist"
                });
            }
        } catch (err) {
            console.log(err);
        }
    });
}