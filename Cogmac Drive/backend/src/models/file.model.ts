import { Schema, model } from "mongoose";

export interface File {
  id: string;
  fileName: string;
  path: string;
  size: string;
  fileType: string;
  uploadedBy: string;
  access?: string;
  access_dept?: string;
  isStarred: boolean;
  isTrashed: boolean;
}
export const fileSchema = new Schema<File>(
  {
    fileName: { type: String, required: true },
    uploadedBy: { type: String, required: true },
    size: { type: String, required: true },
    fileType: { type: String, required: true },
    path: { type: String, required: true },
    access: {
      type: String,
      enum: ["Restricted", "Manager", "Viewer", "Open"],
      default: "Restricted",
    },
    access_dept: { type: String, default: "none" },
    isTrashed: { type: Boolean, required: true, default: false },
    isStarred: { type: Boolean, required: true, default: false },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

export const fileModel = model<File>("Files", fileSchema);
