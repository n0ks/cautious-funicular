import type { Express } from 'express';
import { cors } from '../middlewares/cors';
import { contentType } from '../middlewares/ctype';
import { bodyParser } from '../middlewares/parser';

export class AppMiddlewares {
  static async setup(app: Express) {
    app.use(cors);
    app.use(contentType);
    app.use(bodyParser);
  }
}
