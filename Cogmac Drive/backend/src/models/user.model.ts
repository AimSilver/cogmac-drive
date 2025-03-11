import { Schema, model } from "mongoose";

export interface User {
  id: string;
  name: string;
  email: string;
}
export const userSchema = new Schema<User>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);

export const userModel = model<User>("User", userSchema);
