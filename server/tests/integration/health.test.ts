import request from 'supertest';
import express from 'express';
import { successResponse } from '../../src/utils/api-response';

function createTestApp() {
  const app = express();
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json(successResponse({ status: 'ok', timestamp: new Date().toISOString() }));
  });

  return app;
}

describe('GET /api/health', () => {
  const app = createTestApp();

  it('should return 200 with status ok', async () => {
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('ok');
    expect(res.body.data.timestamp).toBeDefined();
  });
});
