import request from 'supertest';
import { app } from '../../app';

const dummyUserAttrs1 = global.dummyUserAttrs1;
const dummyUserAttrs2 = global.dummyUserAttrs2;

it('should transfer the money from user A to user B, as well as emitting an event', async () => {
  // createUser 1
  await request(app).post('/api/v1/user').send(dummyUserAttrs1).expect(201);

  // createUser 2
  await request(app).post('/api/v1/user').send(dummyUserAttrs2).expect(201);

  // transfer from 1 to 2
  const res = await request(app).post('/api/v1/user/transfer').send({
    to: dummyUserAttrs2.walletAddress,
    privateKey: '',
    amount: '2000',
  });
  //TODO check emit event
  // .expect(400);
});

it('should not transfer if unauthorized', async () => {
  // createUser 1
  await request(app).post('/api/v1/user').send(dummyUserAttrs1).expect(201);

  // createUser 2
  await request(app).post('/api/v1/user').send(dummyUserAttrs2).expect(201);

  // transfer from 1 to 2
  await request(app)
    .post('/api/v1/user/transfer')
    .send({
      to: dummyUserAttrs2.walletAddress,
      privateKey: '',
      amount: '2000',
    })
    .expect(400);
});
