import jwt from 'jsonwebtoken';
import User from '../src/models/user.model.js';

const authMiddleware = async (req, res, next) => {
    let token = req.cookies.token;
    req.user = null;

    if (!token) {
        // return res.status(401).json({ message: "No token provided" });
        // return null;
        // return res.json({ message: "No token provided" });
        console.log("No token provided");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // req.user = await User.findById(decoded._id).select("-password");
        req.user = await User.findById(decoded._id).select('name email role');
        next();
    } catch (error) {
        // return res.json({ message: "Invalid token" });
        console.log("Invalid token")
    }
};

export default authMiddleware;