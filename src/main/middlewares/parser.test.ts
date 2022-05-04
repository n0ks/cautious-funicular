import request from 'supertest';
import app from '../config/app';

describe('Body Parser', () => {
  test('should parse body correctly', async () => {
    app.post('/body_parser', (req, res) => res.send(req.body));

    await request(app).post('/body_parser').send({ foo: 'bar' }).expect({ foo: 'bar' });
  });
});
