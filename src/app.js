import express from 'express';
import routersMsg from './routes/message.routes.js';

const app = express();

app.use(express.json());

app.use(routersMsg);


export default app;