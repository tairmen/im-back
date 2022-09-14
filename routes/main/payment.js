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
        let am = parseFloat(amount);
        let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
        const apis = await models.Api.findAll();
        if (apis.length > 0) {
            let merchant_code = apis[0].merchant_code;
            let merchant_password = apis[0].merchant_password;
            let url = apis[0].url;
            let token = apis[0].token;
            let front = apis[0].front;
            let data = {
                order_amount: am,
                currency: "USD",
                return_url: front,
                failure_url: front,
                ip_address: ip,
                customer: {
                    reference_id: `${req.user.user_id}`,
                    email: req.user.email
                }
            }
            let response = null;
            response = await axios.post(`${url}/fixed-deposit/url`, data, {
                headers: {
                    Authorization: token
                }
            }).catch(async e => {
                console.log(e);
                if (e.response && e.response.data && e.response.data.code == '301') {
                    let auth_res = await axios.post(`${url}/auth/token`, {
                        merchant_code: merchant_code,
                        password: merchant_password
                    }).catch(ee => console.log(ee));
                    if (auth_res && auth_res.data && auth_res.data.code == "00") {
                        token = auth_res.data.data.token;
                        await models.Api.update({
                            token: token
                        }, {
                            where: {
                                merchant_code: merchant_code
                            }
                        });
                        response = await axios.post(`${url}/fixed-deposit/url`, data, {
                            headers: {
                                Authorization: token
                            }
                        }).catch(ee => console.log(ee));
                    }
                } else if (e.response && e.response.data && e.response.data.message) {
                    res.status(200).send({
                        success: false,
                        message: e.response.data.message
                    });
                } else {
                    res.status(200).send({
                        success: false,
                        message: "API error"
                    });
                }
            });
            if (response && response.data && response.data.code == '00') {
                await models.Order.create({
                    order_id: response.data.data.order_id.toString(),
                    payment_url: response.data.data.payment_url,
                    usd_amount: am,
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
            res.status(200).send({
                success: false,
                message: "DB server error"
            });
        }

    });
}