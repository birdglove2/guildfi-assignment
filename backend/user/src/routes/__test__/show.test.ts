import request from 'supertest';
import { app } from '../../app';

const dummyUserAttrs = global.dummyUserAttrs;

it('should return the detail of user', async () => {
  await request(app).post('/api/v1/user').send(dummyUserAttrs).expect(201);

  const res = await request(app)
    .get(`/api/v1/user/${dummyUserAttrs.address}`)
    .send(dummyUserAttrs)
    .expect(200);

  //TODO: should mock getBalance func.
  expect(res.body.result.address).toBe(dummyUserAttrs.address);
  expect(res.body.result.name).toBe(dummyUserAttrs.name);
  expect(res.body.result.balance).toBeDefined();
});

// TODO: for further functionality ?
it('should not return some private details if unauthorized', async () => {});
