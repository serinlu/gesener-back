import User from "../models/user.model.js";
import generateToken from "../../middlewares/generateToken.js";
import bcrypt from "bcryptjs";

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        if (user) {
            return res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        }

        return res.status(400).json({ message: "Invalid user data" });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        const matchPassword = await bcrypt.compare(password, user.password)

        if (user && matchPassword) {
            return res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        }

        return res.status(401).json({ message: "Invalid email or password" });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export { register, login };