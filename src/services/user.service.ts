import { PrismaClient, User, Role } from "../generated/prisma/client";
import { scrypt } from "../utils/scrypt";
import { UserOutput, UserCreationParams, UserRole } from "../types/userType";
import crypto from "crypto";

const prisma = new PrismaClient();


// Fonction utilitaire pour transformer un User en UserOutput
function toUserOutput(user: User): UserOutput { // Pour des mesures de sécurité, on n'expose pas le mot de passe et le token de vérification
    const { password, verificationToken, ...rest } = user;
    return {
        ...rest,
        role: user.role as UserRole, 
    };
}

export class UserService {
    async create(data: UserCreationParams): Promise<UserOutput> {
        const hashedPassword = scrypt.hash(data.password);
        const verificationToken = crypto.randomBytes(32).toString("hex");

        const user = await prisma.user.create({
            data: {
                ...data,
                password: hashedPassword,
                role: data.role || Role.USER,
                verified: false,
                verificationToken,
            },
        });

        return toUserOutput(user);
    }

    async getById(id: number): Promise<UserOutput | null> {
        const user = await prisma.user.findUnique({ where: { id } });
        return user ? toUserOutput(user) : null;
    }

    async getAll(): Promise<UserOutput[]> {
        const users = await prisma.user.findMany();
        return users.map(toUserOutput);
    }

    async update(id: number, data: Partial<User>): Promise<UserOutput> {
        const user = await prisma.user.update({ where: { id }, data });
        return toUserOutput(user);
    }

    async delete(id: number): Promise<UserOutput> {
        const user = await prisma.user.delete({ where: { id } });
        return toUserOutput(user);
    }

    async verifyEmail(token: string): Promise<UserOutput> {
        const user = await prisma.user.findFirst({ where: { verificationToken: token } });
        if (!user) throw new Error("Invalid verification token");
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: { verified: true, verificationToken: null },
        });
        return toUserOutput(updatedUser);
    }
}
