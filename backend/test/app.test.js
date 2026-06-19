const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../config/db', () => ({
  query: jest.fn(),
  connectDb: jest.fn(),
}));

const app = require('../app');
const db = require('../config/db');

// Tests de backend: usan Supertest para simular requests HTTP sin levantar el puerto 3000.
describe('API Express', () => {
  test('GET / responde que el servidor esta funcionando', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.text).toContain('Servidor funcionando');
  });

  test('GET /clientes sin token responde 401', async () => {
    const response = await request(app).get('/clientes');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Falta token' });
  });

  test('GET /clientes con rol no autorizado responde 403', async () => {
    process.env.JWT_SECRET = 'test-secret';
    const token = jwt.sign({ id: 1, rol: 'cliente' }, process.env.JWT_SECRET);

    const response = await request(app)
      .get('/clientes')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(403);
    expect(response.body).toEqual({ error: 'Acceso denegado: permiso insuficiente' });
  });

  test('GET /clientes permite rol tecnico', async () => {
    process.env.JWT_SECRET = 'test-secret';
    db.query.mockImplementationOnce((sql, callback) => callback(null, []));
    const token = jwt.sign({ id: 1, rol: 'tecnico' }, process.env.JWT_SECRET);

    const response = await request(app)
      .get('/clientes')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
});
