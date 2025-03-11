import mongoose, { Schema, Types, model } from "mongoose";

export interface ROLE_MGMT {
  _id: mongoose.Types.ObjectId;
  role: string;
  dept: string;
}

export const rolemgmtSchema = new Schema<ROLE_MGMT>({
  role: { type: String, required: true },
  dept: { type: String, required: true },
});

export interface USER_MGMT {
  id: string;
  userId: Types.ObjectId;

  roles: ROLE_MGMT[];
  isActive: boolean;
  isOnline: boolean;
}
export const userMgmtSchema = new Schema<USER_MGMT>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    roles: { type: [rolemgmtSchema], required: true },
    isActive: { type: Boolean, default: false },
    isOnline: { type: Boolean, required: true, default: false },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

export const userMgmtModel = model<USER_MGMT>(
  "USER MANAGEMENt",
  userMgmtSchema
);
