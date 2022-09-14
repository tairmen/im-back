module.exports = function (app, models, auth) {
    app.post("/callback", async (req, res) => {
        const { order_id, status, type, customer_reference_id, blockchain_tx_id, order_amount, currency, cryptocurrency_amount, cryptocurrency } = req.body;
        await models.Log.create({
            data: JSON.stringify(req.body)
        });
        let signature = req.headers['Signature'];
        if (status == 'COMPLETED') {
            let user_id = parseInt(customer_reference_id);
            await models.Order.update({
                status: 'success',
                usd_amount: order_amount,
                crypto_amount: cryptocurrency_amount,
                cryptocurrency: cryptocurrency
            }, {
                where: {
                    order_id: order_id.toString(),
                    UserId: user_id
                }
            }).catch(e => console.log(e));
            let user = await models.User.findOne({
                where: {
                    id: user_id
                }
            }).catch(e => console.log(e));
            console.log(user)
            let balance = user.balance;
            balance += order_amount;
            await models.User.update({
                balance: balance,
            }, {
                where: {
                    id: user_id
                }
            });
        }
        if (status == 'FAILED' || status == 'EXPIRED') {
            let user_id = parseInt(customer_reference_id);
            await models.Order.update({
                status: 'failed',
                usd_amount: order_amount,
                crypto_amount: cryptocurrency_amount,
                cryptocurrency: cryptocurrency
            }, {
                where: {
                    order_id: order_id.toString(),
                    UserId: user_id
                }
            });
        }
        if (status == 'REFUNDABLE' || status == 'REFUNDED') {
            let user_id = parseInt(customer_reference_id);
            await models.Order.update({
                status: 'refunded',
                usd_amount: order_amount,
                crypto_amount: cryptocurrency_amount,
                cryptocurrency: cryptocurrency
            }, {
                where: {
                    order_id: order_id.toString(),
                    UserId: user_id
                }
            });
        }
        res.status(200).send({
            success: true
        });
    });
}