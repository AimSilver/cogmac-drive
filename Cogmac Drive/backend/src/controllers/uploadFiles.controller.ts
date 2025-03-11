// import asyncHandler from "express-async-handler";
// import fs from "fs";
// import path from "path";

// import { File, fileModel } from "../models/file.model";

// // location for setting the Drive storage (where all files will be uploaded)--->
// const uploadDir = path.join(__dirname, "../../Drive");

// // if Drive location not exists it will create automatically------>
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// // only admin and managers can upload a file so we need to pass their auth middleware later on

// // middleware function for getting files details
// // we have to pass this middleware to upload routes later
// function getFilesDetails(req, res, next) {
//   req.username = req.headers["username"] || "Admin";
//   req.fileName = req.headers["filename"];
//   req.chunkNumber = parseInt(req.headers["chunknumber"], 10);
//   req.totalChunks = parseInt(req.headers["totalchunks"], 10);
//   req.fileType = req.headers["content-type"];
//   req.email = req.headers["email"];
//   req.dept = req.headers["department"];
//   next();
// }

// /* .................................................................................
// .................................................................................... */

// //method for Uploading a file for admin and manager

// export const uploadFile = asyncHandler(async (req: any, res: any) => {
//   const { chunkNumber, username, totalChunks, fileName, email, dept } = req;

//   if (!fileName) {
//     console.error("fileName is undefined");
//     return res.status(400).json({ error: "File name is required." });
//   }
//   const filePath = path.join(uploadDir, fileName);
//   const tempFilePath = `${filePath}.part${chunkNumber}`;
//   const fileStream = fs.createWriteStream(tempFilePath);
//   req.pipe(fileStream);

//   fileStream.on("close", async () => {
//     if (chunkNumber === totalChunks) {
//       const writeStream = fs.createWriteStream(filePath);

//       for (let i = 1; i <= totalChunks; i++) {
//         const tempFile = `${filePath}.part${i}`;
//         const data = fs.readFileSync(tempFile);
//         writeStream.write(data);
//         fs.unlinkSync(tempFile);
//       }

//       writeStream.close();

//       const newFile: File = {
//         id: "",
//         name: fileName,
//         path: filePath,
//         dept: dept,
//         uploadedBy: email,
//         isStarred: false,
//         isTrashed: false,
//       };

//       const savedFile = await fileModel.create(newFile);

//       console.log(`File uploaded: ${fileName} by ${username}`);
//       res
//         .status(200)
//         .json({ message: "File uploaded successfully", savedFile });
//     } else {
//       res.status(200).json({ message: "Chunk uploaded successfully" });
//     }
//   });
//   fileStream.on("error", (err) => {
//     console.error("Error uploading chunk:", err);
//     res.status(500).json({ error: "Server error" });
//   });
// });
