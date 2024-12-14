import jwt from 'jsonwebtoken';
import User from '../src/models/user.model.js';

const authMiddleware = async (req, res, next) => {
    try {
        // Obtener el token desde las cookies
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Buscar al usuario en la base de datos sin incluir la contraseña
        const user = await User.findById(decoded._id).select("-password");
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        // Adjuntar la información del usuario a la solicitud
        req.user = user;

        // Continuar con el siguiente middleware
        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token" });
        }
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired" });
        }

        console.error("Error in auth middleware:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default authMiddleware;
