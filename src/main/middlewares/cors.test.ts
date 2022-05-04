import app from '../config/app';
import request from 'supertest';

describe('Cross Origin', () => {
  test('ensure that cors is enabled', async () => {
    app.get('/cors', (req, res) => res.send());

    await request(app)
      .get('/cors')
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-methods', '*')
      .expect('access-control-allow-headers', '*');
  });
});
