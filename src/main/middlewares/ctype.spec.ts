import app from '../config/app';
import request from 'supertest';

describe('Content type', () => {
  test('ensure content type is json by default', async () => {
    app.get('/ctype', (req, res) => res.send());

    await request(app).get('/ctype').expect('content-type', /json/);
  });
});
