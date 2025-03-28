const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
    const authHeader = req.header("Authorization");
    console.log("Raw Authorization Header:", authHeader); // Added console log

    if (!authHeader) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
        return res.status(401).json({ message: "Unauthorized: Invalid token format" });
    }

    const token = parts[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.log("JWT Verification Error:", error); // added console log.
        return res.status(403).json({ message: "Unauthorized: Invalid token" });
    }
};

const authorizeRole = (roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Forbidden: Insufficient privileges" });
    }
    next();
};

module.exports = { authenticate, authorizeRole };
