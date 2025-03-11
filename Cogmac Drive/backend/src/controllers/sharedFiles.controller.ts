// import asyncHandler from "express-async-handler";
// import { SHARED, sharedModel } from "../models/shared.model";
// import { HTTP_BAD_REQUEST } from "../constants/http_status";

// /* ............................................................................
// .............................................................................. */

// // this method will show users the files someone shared with them

// export const shareWithMeFiles = asyncHandler(async (req, res) => {
//   const email = req.body;
//   const sharedFile = await sharedModel.find({ sharedTo: email });
//   if (!sharedFile) {
//     res.status(HTTP_BAD_REQUEST).send("No file shared with you");
//   }
//   res.send(sharedFile);
// });
