import { Listener, UserUpdatedEvent, Subjects } from '@gfassignment/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { UserService } from 'api/service/user';

export class UserUpdatedListener extends Listener<UserUpdatedEvent> {
  subject: Subjects.UserUpdated = Subjects.UserUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: UserUpdatedEvent['data'], msg: Message) {
    try {
      if (!data.walletAddress) {
        return;
      }

      await UserService.updateUserWallet({
        authId: data.authId,
        walletAddress: data.walletAddress,
      });

      msg.ack();
    } catch (err) {
      console.log('Listen Update User Event Failed!: ', err);
    }
  }
}
