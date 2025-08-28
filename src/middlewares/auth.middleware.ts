import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { EmailService } from "../services/email.service";

const authService = new AuthService(new EmailService());

export interface AuthRequest extends Request { // On étend l'interface Request pour inclure les infos utilisateur
    currentUser?: { userId: number; role: string };
}


// Ce middleware vérifie la présence et la validité d'un token JWT dans les headers Authorization et 
// attache les infos utilisateur décodées à la requête pour les routes protégées
// ce qui permet de savoir qui fait la requête et avec quel rôle (ADMIN ou USER)
export function authenticateByJWT(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"]; 
    if (!authHeader) {
        return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1]; // On split car le header est composé de "Bearer <token>"
    if (!token) {
        return res.status(401).json({ message: "Token missing" });
    }

    try {
        const user = authService.verifyToken(token); // On vérifie et décode le token
        req.currentUser = user; // On attache les infos utilisateur à la requête
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}