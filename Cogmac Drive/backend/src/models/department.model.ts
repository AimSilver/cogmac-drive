import { Schema, model } from "mongoose";
export interface Dept {
  id: string;
  name: string;
}
export const deptSchema = new Schema<Dept>(
  {
    name: { type: String, required: true },
  },
  {
    toJSON: { virtuals: true },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);
export const deptModel = model<Dept>("Department", deptSchema);
