import request from 'supertest';
import { app } from '../../app';
import { natsWrapper } from '../../nats-wrapper';

const dummyUserAttrs = global.dummyUserAttrs;

it('should create user and emit an event successfully', async () => {});

it('should not create user if the user already exists', async () => {
  const res = await request(app).post('/api/user').send(dummyUserAttrs);

  expect(res.status).toBe(201);

  const res2 = await request(app).post('/api/user').send(dummyUserAttrs);
  expect(res2.status).toBe(400);

  // console.log(res2.body);
  //TODO: standardize success and fail response
  // expect(res2.body.errors[0].message).toBe('User already exists!');
});
