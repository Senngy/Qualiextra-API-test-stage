// src/app.ts
import express, { Request, Response, NextFunction } from 'express';
import "dotenv/config";
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { RegisterRoutes } from './routes/routes'; // Routes générées par TSOA
import { authenticateByJWT } from './middlewares/auth.middleware';

dotenv.config();

const PORT = process.env.PORT || 3000;
const allowedOrigins = ['http://localhost:5173']; // ou ton frontend prod

const app = express();

// CORS
app.use(cors({ origin: allowedOrigins }));

// Parser JSON
app.use(express.json());

// Swagger - accessible publiquement
app.use("/docs", swaggerUi.serve, async (req: Request, res: Response) => {
  return res.send(
    swaggerUi.generateHTML(await import("../build/swagger/swagger.json"))
  );
});

// Middleware JWT sur les routes privées seulement
// Exemple : routes commençant par /users nécessitent authentification
app.use('/users', authenticateByJWT);

// TSOA monte les routes
RegisterRoutes(app);


// Gestion des erreurs centralisée
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

// Démarrage serveur
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});