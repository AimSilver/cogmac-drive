import asyncHandler from "express-async-handler";

import { HTTP_BAD_REQUEST } from "../constants/http_status";
import { recentModel } from "../models/recent.model";

/* ................................................................................
................................................................................... */

//method for fetching all recent history ,only admin can see this

export const fetchRecentFilesFn = asyncHandler(async (req: any, res) => {
  console.log("req recieved to fetch recent files");
  const { email } = req.user;
  const recentFiles = await recentModel
    .find({ userEmail: email })
    .sort({ createdAt: -1 })
    .limit(20)
    .populate("file");
  if (!recentFiles) {
    res.status(HTTP_BAD_REQUEST).send("no recent history is available");
    return;
  }
  res.send(recentFiles);
});

// remark later we have to add admin auth midlle ware here
