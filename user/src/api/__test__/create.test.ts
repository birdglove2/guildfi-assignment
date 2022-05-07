import request from 'supertest';
import { app } from '../../app';
import { natsWrapper } from '../../nats-wrapper';

const dummyCreateUserAttrs = global.dummyCreateUserAttrs;

it('should create user and emit an event successfully', async () => {
  const token = global.login();
  const res = await request(app)
    .post('/api/v1/user')
    .set('Authorization', `Bearer ${token}`)
    .send({ ...dummyCreateUserAttrs, signature: process.env.SIGNATURE0 })
    .expect(201);
  const result = res.body.result;
  expect(result.walletAddress).toEqual(dummyCreateUserAttrs.walletAddress);
  expect(result.name).toEqual(dummyCreateUserAttrs.name);
  expect(result.version).toEqual(0);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
  expect(eventData.name).toBe(dummyCreateUserAttrs.name);
  expect(eventData.version).toBe(0);
});

it('should not create user if the user already exists', async () => {
  const { token } = await global.createUser();

  const res = await request(app)
    .post('/api/v1/user')
    .set('Authorization', `Bearer ${token}`)
    .send({ ...dummyCreateUserAttrs, signature: process.env.SIGNATURE0 })
    .expect(400);

  expect(res.body.result[0].message).toBe('User already exists!');
});
