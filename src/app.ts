// src/app.ts
import express,  { Request, Response, NextFunction } from 'express';
import "dotenv/config";
import dotenv from 'dotenv';
import cors from 'cors';
import { RegisterRoutes } from './routes/routes'; // Import des routes générées par TSOA
import { authenticateByJWT } from './middlewares/auth.middleware';

dotenv.config();
const PORT = process.env.PORT || 3000;
const allowedOrigins = ['http://localhost:5173'];

const app = express();

const corsOption = {
  origin: allowedOrigins
}
app.use(cors(corsOption));

 // Pour parser le JSON dans les requêtes
app.use(express.json());

// Brancher les routes générées par TSOA
RegisterRoutes(app);

// Protéger la route users avec le middleware d'authentification
app.use('/users', authenticateByJWT);

// Exemple middleware error handler (simplifié)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

