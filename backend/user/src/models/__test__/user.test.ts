import { User } from '../user';

const dummyUserAttrs = global.dummyUserAttrs;

it('can create and get user from db', async () => {
  const user = User.build(dummyUserAttrs);
  await user.save();
  let fetchUser = await User.findOne({ walletAddress: user.walletAddress });
  expect(fetchUser).not.toBeNull();
  expect(fetchUser!.walletAddress).toEqual(user.walletAddress);

  fetchUser = await User.findOne({ authId: user.authId });
  expect(fetchUser).not.toBeNull();
  expect(fetchUser!.walletAddress).toEqual(user.walletAddress);
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
