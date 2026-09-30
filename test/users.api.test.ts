import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();

describe('Users API', () => {
  it('GET /api/v1/users works', async () => {
    const res = await request(app).get('/api/v1/users');
    expect(res.status).toBe(200);
  });
});
