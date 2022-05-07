import request from 'supertest';
import { app } from '../../app';

it('should list all users store in transaction db', async () => {
  await global.createUser1WithWallet();
  await global.createUser2WithWallet();
  await global.createTransaction();

  let res = await request(app).get(`/api/v1/transaction/listUser`).expect(200);

  const users = res.body.result;
  expect(users.length).toEqual(2);
  expect(users[0].authId).toEqual(global.dummyUserAttrs1.authId);
  expect(users[0].walletAddress).toEqual(global.dummyUserAttrs1.walletAddress);
  expect(users[1].authId).toEqual(global.dummyUserAttrs2.authId);
  expect(users[1].walletAddress).toEqual(global.dummyUserAttrs2.walletAddress);
});

it('should return empty array if no user in the db', async () => {
  let res = await request(app).get(`/api/v1/transaction/listUser`).expect(200);

  const users = res.body.result;
  expect(users.length).toEqual(0);
});
