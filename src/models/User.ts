import { Schema, model, Document} from "mongoose";
import bcrypt from "bcrypt";

interface UserDocument extends Document {
  username: string;
  email: string;
  password: string;
  age: number;
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

