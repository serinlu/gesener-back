import express from 'express';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import User from '../models/user.model.js';
import { google } from 'googleapis';
import bcrypt from 'bcryptjs';

const router = express.Router();

router.post('/send-reset-email', async (req, res) => {
    const { email } = req.body;

    try {
        // Verificar si el usuario existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Generar token único y configurar expiración
        const token = crypto.randomBytes(32).toString('hex');
        const tokenExpiry = Date.now() + 3600000; // 1 hora

        // Guardar token y expiración en el usuario
        user.resetPasswordToken = token;
        user.resetPasswordExpires = tokenExpiry;
        await user.save();

        // Configurar transporte para enviar correo
        const oAuth2Client = new google.auth.OAuth2(
            process.env.GMAIL_CLIENT_ID,
            process.env.GMAIL_CLIENT_SECRET,
            process.env.GMAIL_REDIRECT_URI
        );
        oAuth2Client.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN });

        const accessToken = await oAuth2Client.getAccessToken();
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.GMAIL_USER,
                clientId: process.env.GMAIL_CLIENT_ID,
                clientSecret: process.env.GMAIL_CLIENT_SECRET,
                refreshToken: process.env.GMAIL_REFRESH_TOKEN,
                accessToken: accessToken.token,
            },
        });

        // Enlace de recuperación
        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

        const mailOptions = {
            from: `Recuperación de contraseña <${process.env.GMAIL_USER}>`,
            to: user.email,
            subject: 'Recuperación de contraseña',
            html: `
                <p>Has solicitado recuperar tu contraseña. Haz clic en el siguiente enlace para restablecerla:</p>
                <a href="${resetLink}" style="background: #007bff; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                  Cambiar contraseña
                </a>
                <p>Este enlace es válido por 1 hora.</p>
            `,
        };

        await transport.sendMail(mailOptions);

        res.status(200).json({ message: 'Correo de recuperación enviado', token }); // Devuelve el token para pruebas (solo en desarrollo).
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        res.status(500).json({ message: 'Error al enviar el correo', error });
    }
});

router.get('/verify-reset-token/:token', async (req, res) => {
    const { token } = req.params;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ isValid: false, message: 'Token inválido o expirado.' });
        }

        res.status(200).json({ isValid: true });
    } catch (error) {
        console.error('Error al verificar el token:', error);
        res.status(500).json({ isValid: false, message: 'Error interno al verificar el token.' });
    }
});

router.put('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'El enlace de recuperación no es válido o ha expirado.' });
        }

        // Hashear la nueva contraseña
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Limpiar el token de recuperación después de usarlo
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
        console.error('Error al actualizar la contraseña:', error);
        res.status(500).json({ message: 'Error al actualizar la contraseña', error });
    }
});

export default router;
