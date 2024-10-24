import User from "../models/user.model.js";
import generateToken from "../../middlewares/generateToken.js";
import bcrypt from "bcryptjs";

const register = async (req, res) => {
    const { email, password, name, lastname, companyName, socialReason, ruc, tipoDocumento, numDoc, country, address, province, district, city, phone, postalCode } = req.body;

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: "User already exists" });
    }

    try {
        // Generar un hash para la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crear el nuevo usuario solo con los atributos esenciales
        const user = new User({
            name,
            lastname,
            companyName,
            socialReason,
            ruc,
            tipoDocumento,
            numDoc,
            country,
            address,
            province,
            district,
            city,
            phone,
            postalCode,
            email,
            password: hashedPassword, // Usar el password encriptado
            role: "user", // Si quieres cambiarlo, lo puedes pasar desde el frontend o backend
        });

        // Guardar el usuario en la base de datos
        const userCreated = await user.save();

        // Generar el token
        const token = generateToken(userCreated._id, userCreated.role);

        // Enviar la respuesta con los datos esenciales del usuario y el token
        return res.status(200).json({
            _id: userCreated._id,
            name: userCreated.name,
            lastname: userCreated.lastname,
            email: userCreated.email,
            role: userCreated.role,
            token, // Retornar el token
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verificar si el usuario existe
        const user = await User.findOne({ email });

        if (user) {
            // Comparar las contraseñas
            const matchPassword = await bcrypt.compare(password, user.password);
            console.log(user.password);

            if (matchPassword) {
                // Generar el token
                const token = generateToken(user._id, user.role);

                // Configurar la cookie con el token (ejemplo: 1 día de duración)
                res.cookie('token', token, {
                    httpOnly: true, // Hace que la cookie no sea accesible desde JavaScript del lado del cliente
                    secure: process.env.NODE_ENV === 'production ? true : false', // Solo en HTTPS en producción
                    maxAge: 24 * 60 * 60 * 1000, // 1 día en milisegundos
                    sameSite: 'strict', // Previene ataques CSRF
                });

                // Retornar la respuesta sin el token en el body, ya que está en la cookie
                return res.status(200).json({
                    token
                });
            }
        }

        // Si no se encuentra el usuario o la contraseña no coincide
        return res.status(401).json({ message: "Invalid email or password" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const logout = async (req, res) => {
    try {
        // Limpiar la cookie del token
        res.clearCookie('token');

        return res.status(200).json({ message: "Logged out" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const profile = async (req, res) => {
    try {
        // Obtener el usuario autenticado desde el middleware
        const user = req.user;

        return res.status(200).json({
            _id: user._id,
            name: user.name,
            lastname: user.lastname,
            companyName: user.companyName,
            socialReason: user.socialReason,
            ruc: user.ruc,
            tipoDocumento: user.tipoDocumento,
            numDoc: user.numDoc,
            country: user.country,
            address: user.address,
            province: user.province,
            district: user.district,
            city: user.city,
            postalCode: user.postalCode,
            phone: user.phone,
            email: user.email,
            role: user.role,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const checkPassword = async (req, res) => {
    try {
        const { email, password } = req.body; // Solo obtenemos la contraseña desde el body
        // Verificamos si hay un usuario autenticado desde el middleware
        const user = await User.findOne({ email });

        // Comparar la contraseña ingresada con la almacenada
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            return res.status(401).json({ message: 'Contraseña correcta' });
        }

        // Si la contraseña es correcta
        res.status(200).json({ message: 'Contraseña incorrecta' });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
};


export { register, login, logout, profile, checkPassword };