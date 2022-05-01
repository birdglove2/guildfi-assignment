import { User } from '../user';

const dummyUserAttrs = global.dummyUserAttrs;

it('can create and get user from db', async () => {
  const user = User.build(dummyUserAttrs);
  await user.save();
  const fetchUser = await User.find({ address: user.address });
  expect(fetchUser.length).toBe(1);
  expect(fetchUser[0].address).toEqual(user.address);
});

it('increments the version number on multiple saves', async () => {
  const user = User.build(dummyUserAttrs);

  await user.save();
  expect(user.version).toEqual(0);
  await user.save();
  expect(user.version).toEqual(1);
  await user.save();
  expect(user.version).toEqual(2);
});
