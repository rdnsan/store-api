import { Document, Schema, Model, model } from 'mongoose';

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

const UserSchema: Schema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true, lowercase: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User: Model<IUser> = model<IUser>('User', UserSchema);

export default User;
