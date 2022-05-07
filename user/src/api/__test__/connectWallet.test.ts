import request from 'supertest';
import { app } from '../../app';
import { natsWrapper } from '../../nats-wrapper';

it('should connect wallet and emit an event successfully', async () => {
  const { token, user } = await global.createUser();
  expect(user.walletAddress).toBe(undefined);
  await request(app)
    .post('/api/v1/user/connectWallet')
    .set('Authorization', `Bearer ${token}`)
    .send({ signature: process.env.SIGNATURE0, walletAddress: process.env.WALLET0 })
    .expect(204);

  const res = await request(app).get(`/api/v1/user/walletAddress/${process.env.WALLET0}`);
  const result = res.body.result;

  expect(result.name).toEqual(dummyCreateUserAttrs.name);
  expect(result.walletAddress).toEqual(process.env.WALLET0);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
  const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[1][1]);
  expect(eventData.authId).toEqual(user.authId);
  expect(eventData.walletAddress).toEqual(result.walletAddress);
  expect(eventData.version).toEqual(1);
});
