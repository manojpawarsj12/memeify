import { Schema, model, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface UserDocument extends Document {
  username: string;
  email: string;
  password: string;
  age: number;
  matchesPassword: (password: string) => Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      minlength: 6,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      minlength: 10,
    },
    password: { type: String, required: true },
    //age: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

export const User = model<UserDocument>("User", UserSchema);

UserSchema.pre<UserDocument>("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchesPassword = async function (
  this: UserDocument,
  password: string
):Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};
