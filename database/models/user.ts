import { Schema, model, models } from 'mongoose';

interface IUser {
  userName: string;
  phId: string;
}

const userSchema = new Schema<IUser>(
  {
    userName: {
      type: String,
      unique: true,
      required: true,
    },
    phId: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);

const User = models.user || model<IUser>('user', userSchema);

export default User;
