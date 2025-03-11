import { Schema, Types, model } from "mongoose";

export interface RECENT {
  id: string;
  userEmail: string;
  file: Types.ObjectId;

  action: string;
}

export const recentSchema = new Schema<RECENT>(
  {
    userEmail: { type: String, required: true },

    file: { type: Schema.Types.ObjectId, required: true, ref: "Files" },
    action: { type: String, required: true },
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
export const recentModel = model<RECENT>("RECENT", recentSchema);
