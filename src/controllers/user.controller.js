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
        ruc,
        tipoDocumento,
        numDoc,
        department,
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
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Actualiza solo los campos proporcionados en req.body
        Object.keys(req.body).forEach((key) => {
            if (key !== 'password') { // Se maneja password por separado
                user[key] = req.body[key] !== undefined ? req.body[key] : user[key];
            }
        });

        // Si se envía password, hashearla y actualizarla
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();
        res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const changeRole = async (req, res) => {
    const { id } = req.params; // ID del usuario cuyo rol se va a cambiar
    const { role, password, email } = req.body; // Obteniendo el nuevo rol, la contraseña y el email del admin del cuerpo de la solicitud

    // Función para verificar si el usuario autenticado tiene permisos de admin
    const verifyAdminLog = async (req, res) => {
        const user = req.user; // Usuario autenticado (usando middleware de autenticación)

        // Verificar si el usuario autenticado tiene rol de admin
        if (user.role !== "admin") {
            return res.status(403).json({ message: "No tiene permisos para cambiar el rol de otro usuario" });
        }

        // Validar si el correo proporcionado corresponde a un administrador en la base de datos
        const adminUser = await User.findOne({ email: email });
        if (!adminUser || adminUser.role !== 'admin') {
            return res.status(404).json({ message: "Usuario administrador no encontrado o no tiene permisos de administrador" });
        }

        // Comparar la contraseña ingresada con la almacenada en la base de datos
        const matchPassword = await bcrypt.compare(password, adminUser.password);
        if (!matchPassword) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }
    };

    try {
        // Verificar acceso de admin y validación de correo y contraseña
        await verifyAdminLog(req, res);

        // Buscar el usuario cuyo rol se va a cambiar
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Verificar si el usuario tiene rol de "user" 
        // RESTRICCION PARA EVITAR QUE UN ADMIN CAMBIE EL ROL DE OTRO ADMIN

        // if (user.role !== 'user') {
        //     return res.status(403).json({ message: "Solo se pueden cambiar los roles de usuarios con rol 'user'" });
        // }

        // Cambiar el rol del usuario
        user.role = role;
        await user.save(); // Guardar el usuario actualizado
        res.status(200).json(user); // Enviar respuesta exitosa
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export { getUserById, getAllUsers, updateUser, changeRole };