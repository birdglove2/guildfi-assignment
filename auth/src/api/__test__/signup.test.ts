import request from 'supertest';
import { app } from '../../app';
import jwt from 'jsonwebtoken';
import { AuthPayload } from '@gfassignment/common';

const dummyAuthAttrs = global.dummyAuthAttrs;

it('should return correct token if signup successfully with email, password, and confirm password', async () => {
  const res = await request(app)
    .post('/api/v1/auth/signup')
    .send({
      email: dummyAuthAttrs.email,
      password: dummyAuthAttrs.password,
      confirmPassword: dummyAuthAttrs.password,
    })
    .expect(201);
  const result = res.body.result;
  expect(result.user.id).not.toBeNull();
  expect(result.user.email).toEqual(dummyAuthAttrs.email);
  expect(result.token).not.toBeNull();

  const payload = jwt.verify(result.token, process.env.JWT_KEY!) as AuthPayload;
  expect(payload.authId).toEqual(result.user.id);
  expect(payload.email).toEqual(result.user.email);
});

it('should return 400 if already signup with the email', async () => {
  let res = await request(app)
    .post('/api/v1/auth/signup')
    .send({
      email: dummyAuthAttrs.email,
      password: dummyAuthAttrs.password,
      confirmPassword: dummyAuthAttrs.password,
    })
    .expect(201);

  res = await request(app)
    .post('/api/v1/auth/signup')
    .send({
      email: dummyAuthAttrs.email,
      password: dummyAuthAttrs.password,
      confirmPassword: dummyAuthAttrs.password,
    })
    .expect(400);

  const result = res.body.result;
  expect(result[0].message).toEqual('Email is already in used!');
});

it('should return 400 if no email is not valid', async () => {
  const res = await request(app)
    .post('/api/v1/auth/signup')
    .send({
      email: 'this is invalid email',
      password: dummyAuthAttrs.password,
    })
    .expect(400);
  const result = res.body.result;

  expect(result[0].message).toEqual('Email must be valid');
  expect(result[0].field).toEqual('email');
});

it('should return 400 if no confirm password provided', async () => {
  const res = await request(app)
    .post('/api/v1/auth/signup')
    .send({
      email: dummyAuthAttrs.email,
      password: dummyAuthAttrs.password,
    })
    .expect(400);
  const result = res.body.result;

  expect(result[0].message).toEqual('Confirm Password must be provided');
  expect(result[0].field).toEqual('confirmPassword');
});

it('should return 400 if password is not matched with confirmPassword', async () => {
  const res = await request(app)
    .post('/api/v1/auth/signup')
    .send({
      email: dummyAuthAttrs.email,
      password: dummyAuthAttrs.password,
      confirmPassword: 'asdasdas',
    })
    .expect(400);
  const result = res.body.result;

  expect(result[0].message).toEqual('Password and confirm password are not matched');
});

it('should return 400 if password is not in between 8 and 20 characters', async () => {
  let res = await request(app)
    .post('/api/v1/auth/signup')
    .send({
      email: dummyAuthAttrs.email,
      password: 'asdf',
      confirmPassword: 'asdf',
    })
    .expect(400);
  let result = res.body.result;

  expect(result[0].message).toEqual('Password must be between 8 and 20 characters');

  res = await request(app)
    .post('/api/v1/auth/signup')
    .send({
      email: dummyAuthAttrs.email,
      password: 'asdfasdfasdfasdfasdfasdfasdf',
      confirmPassword: 'asdfasdfasdfasdfasdfasdfasdf',
    })
    .expect(400);
  result = res.body.result;

  expect(result[0].message).toEqual('Password must be between 8 and 20 characters');
});
