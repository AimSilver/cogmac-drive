import { Schema, model } from "mongoose";
export interface SHARED {
  id: string;
  fileName: string;
  fileDept: string;
  token: string;
  expTS: string;
  sharedBy: string;
  sharedTo: string;
}
export const sharedSchema = new Schema<SHARED>(
  {
    fileName: { type: String, required: true },
    fileDept: { type: String, required: true },
    token: { type: String, required: true },
    expTS: { type: String, required: true },
    sharedBy: { type: String, required: true },
    sharedTo: { type: String, required: true },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);
export const sharedModel = model<SHARED>("Shared", sharedSchema);
