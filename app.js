require("dotenv").config();
const express = require("express");
const cors = require('cors')
const get_routes = require("./routes/index");

const app = express();

app.use(express.json());
app.use(cors());

const sequelize = require("./config/database");
const models = sequelize.models;

get_routes(app, models);

module.exports = app;