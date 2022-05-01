import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

// UserAttrs are properties requried to create a new User
export interface UserAttrs {
  address: string;
  name: string;
}

// It is used as an intance of User
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
  findByEvent(event: { id: string; version: number }): Promise<UserDoc | null>;
}

// UserDoc describes what are the attrs
// inside User after querying from the database
interface UserDoc extends mongoose.Document {
  address: string;
  name: number;
  version: number;
  createdAt: string;
  updatedAt: string;
}

// schema for mongoDB
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
  return new User(attrs);
};

// export User that
// has UserModel properties
// and UserDoc attributes
// to use as an instance
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
