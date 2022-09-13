const axios = require('axios');

module.exports = function (app, models, auth) {
    app.post("/payment", auth, async (req, res) => {
        const { amount } = req.body;
        if (!amount) {
            res.status(400).send({
                success: false,
                message: "All input is required"
            });
        }
        let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
        const apis = await models.Api.findAll();
        if (apis.length > 0) {
            let url = apis[0].url;
            let token = apis[0].token;
            let front = apis[0].front;
            let data = {
                order_amount: 100,
                currency: "USD",
                return_url: front,
                failure_url: front,
                ip_address: ip,
                customer: {
                    reference_id: `${req.user.user_id}`,
                    email: req.user.email
                }
            }
            let response = await axios.post(`${url}/fixed-deposit/url`, data, {
                headers: {
                    Authorization: token
                }
            });
            // console.log(response.data);
            if (response.data && response.data.code == '00') {
                await models.Order.create({
                    order_id: response.data.data.order_id,
                    payment_url: response.data.data.payment_url,
                    UserId: req.user.user_id,
                    status: 'processing'
                });
                res.status(200).send({
                    success: true,
                    message: "Payment URL generated",
                    data: response.data.data
                });
            }
        } else {
            res.status(409).send({
                success: false,
                message: "DB server error"
            });
        }

    });
}