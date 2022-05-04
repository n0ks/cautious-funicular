import express from 'express';
import { AppMiddlewares } from './middlewares';

const app = express();

AppMiddlewares.setup(app);

export default app;
