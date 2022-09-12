require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());

const sequelize = require("./config/database");
const models = sequelize.models;

const auth = require("./middleware/auth");

// Register
app.post("/register", async (req, res) => {

    try {

        const { name, email, password } = req.body;

        if (!(email && password && name)) {
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
            name,
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

        const user = await User.findOne({ where: { email } });

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
        }
        res.status(400).send({
            success: false,
            message: "Invalid Credentials"
        });
    } catch (err) {
        console.log(err);
    }
});

app.get("/welcome", auth, (req, res) => {
    res.status(200).send({
        success: true,
        message: "Welcome 🙌 "
    });
});

module.exports = app;