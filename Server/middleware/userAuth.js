import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ success: false, message: "UnauthorizedToken" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.userId) {
            req.body = req.body || {};
            req.body.userId = decoded.userId;
        } else {
            return res.status(401).json({ success: false, message: "Unauthorized: Invalid token payload" })
        }
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Unauthorized: " + error.message });
    }
};
export default userAuth;