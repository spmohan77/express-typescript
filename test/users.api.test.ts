import request from 'supertest';
import { createApp } from '../src/app';

process.env.AUTH_API_KEYS = 'admin-test-key:ADMIN,member-test-key:MEMBER';

const app = createApp();

describe('Users API', () => {
  it('GET /api/v1/users requires authentication', async () => {
    const res = await request(app).get('/api/v1/users');
    expect(res.status).toBe(401);
  });

  it('GET /api/v1/users works for an authenticated user', async () => {
    const res = await request(app)
      .get('/api/v1/users')
      .set('x-api-key', 'member-test-key');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/v1/users/:id validates the id', async () => {
    const res = await request(app)
      .get('/api/v1/users/not-a-number')
      .set('x-api-key', 'member-test-key');

    expect(res.status).toBe(400);
  });

  it('GET /api/v1/users/:id returns 404 for an unknown user', async () => {
    const res = await request(app)
      .get('/api/v1/users/999')
      .set('x-api-key', 'member-test-key');

    expect(res.status).toBe(404);
  });

  it('POST /api/v1/users is forbidden for members', async () => {
    const res = await request(app)
      .post('/api/v1/users')
      .set('x-api-key', 'member-test-key')
      .send({
        name: 'New Person',
        email: 'new@example.com',
        role: 'MEMBER',
      });

    expect(res.status).toBe(403);
  });

  it('POST /api/v1/users validates input', async () => {
    const res = await request(app)
      .post('/api/v1/users')
      .set('x-api-key', 'admin-test-key')
      .send({
        name: 'A',
        email: 'not-an-email',
        unexpected: true,
      });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('POST /api/v1/users creates a user for an admin', async () => {
    const res = await request(app)
      .post('/api/v1/users')
      .set('x-api-key', 'admin-test-key')
      .send({
        name: 'New Person',
        email: 'new@example.com',
        role: 'MEMBER',
      });

    expect(res.status).toBe(201);
    expect(res.body.email).toBe('new@example.com');
  });

  it('POST /api/v1/users rejects duplicate emails', async () => {
    const res = await request(app)
      .post('/api/v1/users')
      .set('x-api-key', 'admin-test-key')
      .send({
        name: 'Another Person',
        email: 'NEW@example.com',
        role: 'MEMBER',
      });

    expect(res.status).toBe(409);
  });
});
