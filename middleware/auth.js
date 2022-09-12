const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
    const bearer_token = req.headers["authorization"];
    if (!bearer_token || bearer_token.length < 7) {
        return res.status(403).send({
            success: false,
            message: "A token is required for authentication"
        });
    }
    const token = bearer_token.slice(7, bearer_token.length);
    try {
        const decoded = jwt.verify(token, config.TOKEN_KEY);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send({
            success: false,
            message: "Invalid Token"
        });
    }
    return next();
};

module.exports = verifyToken;