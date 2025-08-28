// src/services/email.service.ts
import nodemailer from "nodemailer";

export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER, // ton email Gmail
                pass: process.env.EMAIL_PASS, // mot de passe d'application généré
            },
        });
    }

    async sendVerificationEmail(to: string, token: string, firstname: string) {
        const verificationLink = `${process.env.APP_URL}/auth/verify-email?token=${token}`;
        const userName = firstname;

        const mailOptions = {
            from: `"QualiExtra" <${process.env.EMAIL_USER}>`,
            to,
            subject: "Vérifie ton email 🚀",
            html: `
        <div style="font-family: system-ui, sans-serif, Arial; font-size: 14px; color: #333; padding: 20px 14px; background-color: #f5f5f5;">
           <div style="max-width: 600px; margin: auto; background-color: #fff;">
                <div style="text-align: center; background-color: #333; padding: 14px;"><a style="text-decoration: none; outline: none;" href="https://qualiextra.com/" target="_blank" rel="noopener"> <img src="https://qualiextra.com/logo.svg" alt="QualiExtra logo" width="120" height="32" style="display:block; margin:auto;"> </a></div>
                <div style="padding: 14px;">
                    <h1 style="font-size: 22px; margin-bottom: 26px;">Bienvenue chez Qualiextra ${userName}&nbsp;</h1>
                    <p>Cliquez sur le lien ci-dessous pour finalisez votre inscription:</p>
                    <p><a href="${verificationLink}">Cliquez ici</a></p>
                    <p>Ce lien expirera dans 1 heure.</p>
                    <p>Si vous n'&ecirc;tes pas &agrave; l'origine de cette demande d'inscription, veuillez ignorer ce mail.</p>
                    <p>Cordialement,<br>La team Qualiextra</p>
                </div>
            </div>    
        </div>
        `,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`✅ Email envoyé à ${to}`);
        } catch (err) {
            console.error("❌ Erreur envoi email:", err);
            throw new Error("Impossible d'envoyer l'email de vérification");
        }
    }
}