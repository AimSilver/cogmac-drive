import { Schema, model } from "mongoose";
export interface Roles {
  id: string;
  name: string;
}
export const roleSchema = new Schema<Roles>(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: { virtuals: true },
    timestamps: true,
  }
);
export const roleModel = model<Roles>("Roles", roleSchema);
