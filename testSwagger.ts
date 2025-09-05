import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './build/swagger/swagger.json';

const app = express();

app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(3001, () => console.log('http://localhost:3001/swagger-ui'));