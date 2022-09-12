require("dotenv").config();
const express = require("express");
const get_routes = require("./routes/index");

const app = express();

app.use(express.json());

const sequelize = require("./config/database");
const models = sequelize.models;

get_routes(app, models);

module.exports = app;