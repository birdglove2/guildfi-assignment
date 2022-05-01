import request from 'supertest';
import { app } from '../../app';
import { natsWrapper } from '../../nats-wrapper';

const dummyUserAttrs = global.dummyUserAttrs;

it('should create user and emit an event successfully', async () => {
  await request(app).post('/api/user').send(dummyUserAttrs).expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
  expect(eventData.address).toBe(dummyUserAttrs.address);
  expect(eventData.name).toBe(dummyUserAttrs.name);
  expect(eventData.version).toBe(0);
});

it('should not create user if the user already exists', async () => {
  await request(app).post('/api/user').send(dummyUserAttrs).expect(201);

  const res = await request(app).post('/api/user').send(dummyUserAttrs).expect(400);
  expect(res.body.result.length).toBe(1);
  expect(res.body.result[0].message).toBe('User already exists!');
});
