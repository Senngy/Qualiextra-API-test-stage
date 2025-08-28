import jwt from "jsonwebtoken";
import { PrismaClient, User, Role } from "../generated/prisma/client";
import { UserOutput, UserRole, UserCreationParams } from "../types/userType";
import { scrypt } from "../utils/scrypt";
import crypto from "crypto";
import { EmailService } from "./email.service";
import { isDisposableEmail } from "../utils/disposableEmail";

const JWT_SECRET = process.env.JWT_SECRET;
const prisma = new PrismaClient();

function toUserOutput(user: User): UserOutput {
    const { password, verificationToken, ...rest } = user;
    return {
        ...rest,
        role: user.role as UserRole,
    };
}

export class AuthService {
    constructor(private emailService: EmailService) { }

    generateToken(user: User): string {
        if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");
        const payload = { userId: user.id, role: user.role };
        return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
    }

    verifyToken(token: string): { userId: number; role: UserRole } {
        if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");
        try {
            return jwt.verify(token, JWT_SECRET) as { userId: number; role: UserRole }; // On utilise 'jwt.verify' pour décoder et vérifier le token et on associe le type
        } catch {
            throw new Error("Invalid token");
        }
    }


    async loginUser(email: string, password: string) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) throw new Error("Email ou mot de passe incorrect");

        // Vérification du mot de passe ici...
        const isPasswordValid = scrypt.compare(password, user.password);
        if (!isPasswordValid) throw new Error("Email ou mot de passe incorrect");

        // Vérification du statut email
        if (!user.verified) throw new Error("Email non vérifié. Merci de vérifier votre boîte mail.");

        // Génération du token JWT
        const token = this.generateToken(user);

        return { user: toUserOutput(user), token };
    }

    async registerUser(data: UserCreationParams): Promise<UserOutput> {
        if (isDisposableEmail(data.email)) {
            throw new Error("Registration using disposable email addresses is not allowed.");
        }

        const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
        if (existingUser) throw new Error("Email already in use");

        const hashedPassword = scrypt.hash(data.password);
        const user = await prisma.user.create({
            data: {
                firstname: data.firstname,
                name: data.name,
                email: data.email,
                password: hashedPassword,
                role: data.role || Role.USER,
                verified: false,
                verificationToken: crypto.randomBytes(32).toString("hex"),
            },
        });
        // après la création de l’utilisateur → envoi email
        await this.emailService.sendVerificationEmail(
            user.email,
            user.verificationToken!,
            user.firstname
        );

        return toUserOutput(user);
    }

    async verifyEmail(token: string): Promise<boolean> {
        const user = await prisma.user.findFirst({ where: { verificationToken: token } });
        if (!user) return false;

        await prisma.user.update({
            where: { id: user.id },
            data: { verified: true, verificationToken: null },
        });

        return true;
    }
}