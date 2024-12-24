import bcrypt from "bcryptjs";
import crypto from "crypto";
import { google } from "googleapis";
import nodemailer from "nodemailer";
import generateToken from "../../middlewares/generateToken.js";
import User from "../models/user.model.js";

export const register = async (req, res) => {
    const {
        email,
        password,
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
    } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists)
        return res.status(400).json({ message: "El usuario ya existe" });

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const verificationToken = crypto.randomBytes(32).toString("hex");
        const verificationTokenExpiry = Date.now() + 3600000; // 1 hora

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
            phone,
            postalCode,
            email,
            password: hashedPassword,
            role: "user",
            isVerified: false,
            verificationToken,
            verificationTokenExpires: verificationTokenExpiry,
        });

        await user.save();

        // Llama a la función para enviar el correo
        await sendVerificationEmail(user.email, verificationToken, name);

        return res.status(201).json({
            message:
                "Usuario registrado. Por favor verifica tu correo electrónico.",
            verificationToken,
        });
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        return res.status(500).json({ message: error.message });
    }
};

const sendVerificationEmail = async (email, token, name) => {
    try {
        const oAuth2Client = new google.auth.OAuth2(
            process.env.GMAIL_CLIENT_ID,
            process.env.GMAIL_CLIENT_SECRET,
            process.env.GMAIL_REDIRECT_URI
        );
        oAuth2Client.setCredentials({
            refresh_token: process.env.GMAIL_REFRESH_TOKEN,
        });

        const accessToken = await oAuth2Client.getAccessToken();
        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: process.env.GMAIL_USER,
                clientId: process.env.GMAIL_CLIENT_ID,
                clientSecret: process.env.GMAIL_CLIENT_SECRET,
                refreshToken: process.env.GMAIL_REFRESH_TOKEN,
                accessToken: accessToken.token,
            },
        });

        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;

        const mailOptions = {
            from: `Verificación de cuenta <${process.env.GMAIL_USER}>`,
            to: email,
            subject: "Verifica tu cuenta",
            html: `
                <p>Hola ${name},</p>
                <p>Gracias por registrarte. Por favor, verifica tu cuenta haciendo clic en el siguiente enlace:</p>
                <a href="${verificationUrl}" style="background: #007bff; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                  Verificar mi cuenta
                </a>
                <p>Este enlace es válido por 1 hora.</p>
            `,
        };

        await transport.sendMail(mailOptions);
    } catch (error) {
        console.error("Error al enviar el correo de verificación:", error);
        throw new Error("No se pudo enviar el correo de verificación");
    }
};

export const checkEmailExists = async (req, res) => {
    const { email } = req.body;

    try {
        // Verificar si el correo existe en la base de datos
        const user = await User.findOne({ email });

        if (user) {
            return res.status(200).json({
                exists: true,
                message: "El correo ya está registrado.",
            });
        }

        return res
            .status(200)
            .json({ exists: false, message: "El correo no está registrado." });
    } catch (error) {
        console.error("Error al verificar el correo:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
};

export const checkToken = async (req, res) => {
    const { token } = req.params;

    try {
        // Buscar al usuario con el token proporcionado y verificar que no esté expirado
        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpires: { $gt: Date.now() }, // El token no debe estar expirado
        });

        // Si no se encuentra el usuario o el token es inválido
        if (!user) {
            return res
                .status(400)
                .json({ message: "Token inválido o expirado." });
        }

        // Respuesta indicando que el token es válido
        res.status(200).json({
            message: "Token válido. Procede con la verificación.",
        });
    } catch (error) {
        console.error("Error al verificar el token:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const verifyEmail = async (req, res) => {
    const { token } = req.params;

    try {
        // Buscar al usuario con el token de verificación y que el token no haya expirado
        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpires: { $gt: Date.now() }, // Verificar que no esté expirado
        });

        if (!user) {
            return res
                .status(400)
                .json({ message: "Token inválido o expirado." });
        }

        // Si el usuario ya está verificado, no es necesario hacer más
        if (user.isVerified) {
            return res
                .status(200)
                .json({ message: "El correo ya ha sido verificado." });
        }

        // Marcar al usuario como verificado
        user.isVerified = true;

        // Eliminar el token y la fecha de expiración
        user.verificationToken = null;
        user.verificationTokenExpires = null;

        // Guardar los cambios en la base de datos
        await user.save();

        // Responder con mensaje de éxito
        res.status(200).json({
            message:
                "Correo verificado con éxito. Ahora puedes iniciar sesión.",
        });
    } catch (error) {
        console.error("Error al verificar el correo:", error);
        res.status(500).json({
            message: "Error interno al verificar el correo.",
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user) {
            const matchPassword = await bcrypt.compare(password, user.password);

            if (matchPassword) {
                const token = generateToken(user._id, user.role);
                res.cookie("token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',  
                    maxAge: 24 * 60 * 60 * 1000,
                    sameSite: 'None',
                });

                return res.status(200).json({ token, user });
            }
        }

        return res.status(401).json({ message: "Invalid email or password" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({ message: "Logged out" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const profile = async (req, res) => {
    try {
        const user = req.user;

        // Verificar si el usuario está disponible
        if (!user) {
            return res
                .status(400)
                .json({ message: "User not found or not authenticated" });
        }

        // Devolver el perfil del usuario
        return res.status(200).json({
            success: true,
            message: "User profile retrieved successfully",
            user,
        });
    } catch (error) {
        console.error("Error retrieving user profile:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while retrieving the profile",
        });
    }
};

export const checkPassword = async (req, res) => {
    try {
        const { password } = req.body;
        const userId = req.user._id;
        const user = await User.findById(userId).select("password");

        if (!user)
            return res.status(404).json({ message: "Usuario no encontrado" });

        if (!password)
            return res
                .status(400)
                .json({ message: "La contraseña es requerida" });

        const isMatch = await bcrypt.compare(password, user.password);

        return isMatch
            ? res.status(200).json({ message: "Contraseña correcta" })
            : res.status(401).json({ message: "Contraseña incorrecta" });
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor" });
    }
};
