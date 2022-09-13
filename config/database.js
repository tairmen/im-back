const { Sequelize, DataTypes, Model } = require('sequelize');
const { PG_URI, FORCE } = process.env;

const sequelize = new Sequelize(PG_URI);
const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
    },
    email: { type: DataTypes.STRING, unique: true },
    phone: { type: DataTypes.STRING },
    balance: { type: DataTypes.FLOAT },
    password: { type: DataTypes.STRING, allowNull: false },
    token: { type: DataTypes.STRING },
});

const Api = sequelize.define('Api', {
    url: {
        type: DataTypes.STRING,
    },
    merchant_code: {
        type: DataTypes.STRING,
    },
    merchant_password: {
        type: DataTypes.STRING,
    },
    secret: {
        type: DataTypes.STRING,
    },
    token: { type: DataTypes.TEXT },
    front: { type: DataTypes.STRING },
});

const Order = sequelize.define('Order', {
    order_id: {
        type: DataTypes.STRING,
    },
    payment_url: { type: DataTypes.STRING },
    status: { type: DataTypes.ENUM('success', 'processing', 'failed', 'refunded') }
});
Order.belongsTo(User);
if (FORCE) {
    sequelize.sync({ force: true })
}

module.exports = sequelize;
