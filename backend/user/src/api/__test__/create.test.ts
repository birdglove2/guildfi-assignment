import request from 'supertest';
import { app } from '../../app';
import { natsWrapper } from '../../nats-wrapper';

const dummyUserAttrs0 = global.dummyUserAttrs0;

it('should create user and emit an event successfully', async () => {
  const token = global.login();
  const res = await request(app)
    .post('/api/v1/user')
    .set('Authorization', `Bearer ${token}`)
    .send({ ...dummyUserAttrs0, signature: process.env.SIGNATURE0 })
    .expect(201);
  const result = res.body.result;
  expect(result.walletAddress).toEqual(dummyUserAttrs0.walletAddress);
  expect(result.name).toEqual(dummyUserAttrs0.name);
  expect(result.version).toEqual(0);

  // console.log('nats', natsWrapper.client.publish.toString());
  // expect(natsWrapper.client.publish).toHaveBeenCalled();

  // const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
  // expect(eventData.address).toBe(dummyUserAttrs.address);
  // expect(eventData.name).toBe(dummyUserAttrs.name);
  // expect(eventData.version).toBe(0);
});

it('should not create user if the user already exists', async () => {
  const { token } = await global.createUser();

  const res = await request(app)
    .post('/api/v1/user')
    .set('Authorization', `Bearer ${token}`)
    .send({ ...dummyUserAttrs0, signature: process.env.SIGNATURE0 })
    .expect(400);

  expect(res.body.result[0].message).toBe('User already exists!');
});
