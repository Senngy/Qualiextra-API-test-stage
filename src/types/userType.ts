// src/types/userType.ts
import type { Role as PrismaRole } from "../generated/prisma/client"; // utiliser le type généré par Prisma

export type UserRole = PrismaRole; // alias, clair et sans duplication pour tsoa

export type UserOutput = { // Pour definir les infos retournés, ici on ne renvoi pas le mot de passe
  id: number;
  firstname: string;
  name: string;
  email: string;
  role: UserRole;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export interface UserCreationParams { // Définissions des paramètres nécessaires à la création d'un utilsateur
  firstname: string;
  name: string;
  email: string;
  password: string;
  role?: UserRole; // facultatif, par défaut USER
}

export function toUserOutput(user: {  // Fonction pour transformé User en UserOutPut
  id: number; 
  firstname: string; 
  name: string; 
  email: string; 
  role: PrismaRole; 
  verified: boolean; 
  createdAt: Date; 
  updatedAt: Date; 
}): UserOutput {
  return {
    ...user,
    role: user.role as UserRole,
  };
}