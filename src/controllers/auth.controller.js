import User from "../models/user.model.js";
import generateToken from "../../middlewares/generateToken.js";
import bcrypt from "bcryptjs";

const register = async (req, res) => {
    const { email, password, name, lastname, companyName, socialReason, ruc, tipoDocumento, numDoc, department, address, province, district, city, phone, postalCode } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) return res.status(400).json({ message: "User already exists" });

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new User({
            name,
            lastname,
            companyName,
            socialReason,
            ruc,
            tipoDocumento,
            numDoc,
            department,
            address,
            province,
            district,
            city,
            phone,
            postalCode,
            email,
            password: hashedPassword,
            role: "user",
        });

        const userCreated = await user.save();
        const token = generateToken(userCreated._id, userCreated.role);
        return res.status(200).json({
            _id: userCreated._id,
            name: userCreated.name,
            lastname: userCreated.lastname,
            email: userCreated.email,
            role: userCreated.role,
            token,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user) {
            const matchPassword = await bcrypt.compare(password, user.password);

            if (matchPassword) {
                const token = generateToken(user._id, user.role);
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production ? true : false',
                    maxAge: 24 * 60 * 60 * 1000,
                    sameSite: 'strict',
                });

                return res.status(200).json({ token, user });
            }
        }

        return res.status(401).json({ message: "Invalid email or password" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const logout = async (req, res) => {
    try {
        res.clearCookie('token');
        return res.status(200).json({ message: "Logged out" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const profile = async (req, res) => {
    try {
        const user = req.user;
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const checkPassword = async (req, res) => {
    try {
        const { password } = req.body;
        const userId = req.user._id;
        const user = await User.findById(userId).select('password');
        const isMatch = await bcrypt.compare(password, user.password);

        return isMatch
            ? res.status(200).json({ message: 'Contraseña correcta' })
            : res.status(401).json({ message: 'Contraseña incorrecta' })
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

export { register, login, logout, profile, checkPassword };