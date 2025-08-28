// src/types/userType.ts
import type { Role as PrismaRole } from "../generated/prisma/client"; // utiliser le type généré par Prisma

export type UserRole = PrismaRole; // alias, clair et sans duplication pour tsoa

export type UserOutput = {
  id: number;
  firstname: string;
  name: string;
  email: string;
  role: UserRole;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export interface UserCreationParams {
  firstname: string;
  name: string;
  email: string;
  password: string;
  role?: UserRole; // facultatif, par défaut USER
}

export function toUserOutput(user: { 
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