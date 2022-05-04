import request from 'supertest';
import { app } from '../../app';
import jwt from 'jsonwebtoken';
import { UserPayload } from '@gfassignment/common';
const dummyCredentials = global.dummyCredentials;

it('should login successfully with correct signature and message', async () => {
  const res = await request(app).post('/api/v1/auth/login').send(dummyCredentials).expect(200);
  const { walletAddress, token } = res.body.result;
  expect(walletAddress).toBe(dummyCredentials.walletAddress);

  const payload = jwt.verify(token, process.env.JWT_KEY!) as UserPayload;
  expect(payload.walletAddress).toBe(walletAddress);
});

it('should return 401 if wallet address is not matched with signature', async () => {
  await request(app)
    .post('/api/v1/auth/login')
    .send({
      signature: dummyCredentials.signature,
      walletAddress: '0xEc2B5522F284650784966E38F5f035082Ef72749',
    })
    .expect(401);
});

it('should fail if send incorrect format of signature', async () => {
  await request(app)
    .post('/api/v1/auth/login')
    .send({
      signature: 'this is fake signature',
      walletAddress: dummyCredentials.walletAddress,
    })
    .expect(500);
});
