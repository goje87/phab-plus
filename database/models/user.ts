import { Schema, model } from 'mongoose';

interface IUser {
  userName: string;
}

const userSchema = new Schema<IUser>(
  {
    userName: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);

const User = model<IUser>('user', userSchema);

export default User;
