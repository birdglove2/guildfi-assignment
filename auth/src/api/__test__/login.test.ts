import request from 'supertest';
import { app } from '../../app';
import jwt from 'jsonwebtoken';
import { AuthPayload } from '@gfassignment/common';

const dummyAuthAttrs = global.dummyAuthAttrs;

it('should login successfully with correct signature and message', async () => {
  await global.signup();

  const res = await request(app)
    .post('/api/v1/auth/login')
    .send({
      email: dummyAuthAttrs.email,
      password: dummyAuthAttrs.password,
    })
    .expect(200);

  const result = res.body.result;
  expect(result.user.id).not.toBeNull();
  expect(result.user.email).toEqual(dummyAuthAttrs.email);
  expect(result.token).not.toBeNull();

  const payload = jwt.verify(result.token, process.env.JWT_KEY!) as AuthPayload;
  expect(payload.authId).toEqual(result.user.id);
  expect(payload.email).toEqual(result.user.email);
});

it('should return 400 if not signup yet', async () => {
  const res = await request(app)
    .post('/api/v1/auth/login')
    .send({
      email: dummyAuthAttrs.email,
      password: dummyAuthAttrs.password,
    })
    .expect(400);

  const result = res.body.result;
  expect(result[0].message).toEqual('Invalid email or password');
});

it('should return 400 if email or password incorrect', async () => {
  await global.signup();

  let res = await request(app)
    .post('/api/v1/auth/login')
    .send({
      email: dummyAuthAttrs.email,
      password: 'asdads',
    })
    .expect(400);

  let result = res.body.result;
  expect(result[0].message).toEqual('Invalid email or password');

  res = await request(app)
    .post('/api/v1/auth/login')
    .send({
      email: 'x@test.com',
      password: dummyAuthAttrs.password,
    })
    .expect(400);

  result = res.body.result;
  expect(result[0].message).toEqual('Invalid email or password');
});

it('should return 400 if email or password or both are not provided', async () => {
  await global.signup();

  let res = await request(app)
    .post('/api/v1/auth/login')
    .send({
      email: dummyAuthAttrs.email,
    })
    .expect(400);

  let result = res.body.result;
  expect(result[0].message).toEqual('Password must be provided');

  res = await request(app)
    .post('/api/v1/auth/login')
    .send({
      password: dummyAuthAttrs.password,
    })
    .expect(400);

  result = res.body.result;
  expect(result[0].message).toEqual('Email must be provided');

  res = await request(app).post('/api/v1/auth/login').expect(400);

  result = res.body.result;
  expect(result[0].message).toEqual('Email must be provided');
  expect(result[1].message).toEqual('Password must be provided');
});

// it('should return 401 if wallet address is not matched with signature', async () => {
//   await request(app)
//     .post('/api/v1/auth/login')
//     .send({
//       signature: dummyAuthAttrs.signature,
//       walletAddress: '0xEc2B5522F284650784966E38F5f035082Ef72749',
//     })
//     .expect(401);
// });

// it('should fail if send incorrect format of signature', async () => {
//   await request(app)
//     .post('/api/v1/auth/login')
//     .send({
//       signature: 'this is fake signature',
//       walletAddress: dummyAuthAttrs.walletAddress,
//     })
//     .expect(500);
// });
