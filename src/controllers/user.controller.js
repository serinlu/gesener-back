import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id).select("-password");
        res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const updateUser = async (req, res) => {
    const { id } = req.params;
    const {
        name,
        lastname,
        companyName,
        socialReason,
        tipoDocumento,
        numDoc,
        country,
        address,
        province,
        district,
        phone,
        postalCode,
        email,
        password
    } = req.body;

    try {
        const user = await User.findById(id);

        // Actualizar solo si se proporcionan nuevos valores
        user.name = name || user.name;
        user.lastname = lastname || user.lastname;
        user.companyName = companyName || user.companyName;
        user.socialReason = socialReason || user.socialReason;
        user.tipoDocumento = tipoDocumento || user.tipoDocumento;
        user.numDoc = numDoc || user.numDoc;
        user.country = country || user.country;
        user.address = address || user.address;
        user.province = province || user.province;
        user.district = district || user.district;
        user.phone = phone || user.phone;
        user.postalCode = postalCode || user.postalCode;
        user.email = email || user.email;

        if (password) {
            const salt = await bcrypt.genSalt(10); // Generar salt (si usas bcrypt)
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();
        res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export { getUserById, getAllUsers, updateUser };