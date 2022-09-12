const { Sequelize, DataTypes, Model } = require('sequelize');
const { PG_URI, FORCE } = process.env;

const sequelize = new Sequelize(PG_URI);
const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
    },
    email: { type: DataTypes.STRING, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    token: { type: DataTypes.STRING },
});

if (FORCE) {
    sequelize.sync({force: true})
}

module.exports = sequelize;
