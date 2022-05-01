import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface UserAttrs {
  id: string;
  address: string;
  name: string;
}

export interface UserDoc extends mongoose.Document {
  address: string;
  name: number;
  version: number;
  isReserved(): Promise<boolean>;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
  findByEvent(event: { id: string; version: number }): Promise<UserDoc | null>;
}

const userSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

userSchema.set('versionKey', 'version');
userSchema.plugin(updateIfCurrentPlugin);

userSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return User.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
  });
};
// userSchema.methods.isReserved = async function () {
//   // this === the User document that we just called 'isReserved' on
//   const existingOrder = await Order.findOne({
//     User: this as any,
//     status: {
//       $in: [OrderStatus.Created, OrderStatus.AwaitingPayment, OrderStatus.Complete],
//     },
//   });

//   return !!existingOrder;
// };

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
