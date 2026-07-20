const jwt = require('jsonwebtoken');

const jwtAuth = (req, res, next) => {
    console.log("cookies:", req.cookies);
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Please login"
        });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_TOKEN
        );

        req.user = decoded;

        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

module.exports = jwtAuth;