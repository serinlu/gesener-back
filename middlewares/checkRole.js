// middlewares/checkRole.js
const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(403).json({ message: "Access denied, role not found." });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "You don't have the required role to access this resource." });
        }

        next();
    };
};

export default checkRole;
