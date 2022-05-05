import request from 'supertest';
import { app } from '../../app';

it('should return the detail of user by authId or walletAddress', async () => {
  const { user } = await global.createUser();

  let res = await request(app).get(`/api/v1/user/${user.authId}`).expect(200);

  const getUser1 = res.body.result;
  expect(getUser1.walletAddress).toBe(user.walletAddress);
  expect(getUser1.name).toBe(user.name);
  expect(getUser1.balance).toBeDefined();

  res = await request(app).get(`/api/v1/user/walletAddress/${user.walletAddress}`).expect(200);
  const getUser2 = res.body.result;
  expect(getUser1).toEqual(getUser2);
});

it('should return 404 if user not found', async () => {
  await global.createUser();

  let res = await request(app).get(`/api/v1/user/6273b99024828ca72ea0a32e`).expect(404);
  let result = res.body.result;
  expect(result[0].message).toEqual('User Not Found');

  res = await request(app)
    .get(`/api/v1/user/walletAddress/0xdd818a10aaf0ccdc3aa032bda6595c1fd3ef750d`)
    .expect(404);
  result = res.body.result;
  expect(result[0].message).toEqual('User Not Found');

  res = await request(app).get(`/api/v1/user/2213`).expect(404);
  result = res.body.result;
  expect(result[0].message).toEqual('User Not Found');

  res = await request(app).get(`/api/v1/user/walletAddress/wqeqweq`).expect(404);
  result = res.body.result;
  expect(result[0].message).toEqual('User Not Found');
});
