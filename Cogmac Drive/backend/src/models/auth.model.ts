import { Schema, model } from "mongoose";
export interface Auth {
  id: string;
  email: string;
  password: string;
  isAdmin: boolean;
  isManager: boolean;
}

export const authSchema = new Schema<Auth>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    isManager: { type: Boolean, default: false },
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
export const authModel = model<Auth>("Auth", authSchema);
