import request from 'supertest';
import { app } from '../../app';

const dummyUserAttrs = global.dummyUserAttrs;

it('should return the detail of user', async () => {
  await request(app).post('/api/user').send(dummyUserAttrs).expect(201);

  const res = await request(app)
    .get(`/api/user/${dummyUserAttrs.address}`)
    .send(dummyUserAttrs)
    .expect(200);

  expect(res.body.result.address).toBe(dummyUserAttrs.address);
  expect(res.body.result.name).toBe(dummyUserAttrs.name);
});

// TODO: for further functionality ?
it('should not return some private details if unauthorized', async () => {});
