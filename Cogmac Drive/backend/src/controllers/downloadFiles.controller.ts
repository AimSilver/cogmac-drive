import asyncHandler from "express-async-handler";
import fs from "fs";
import path from "path";
import { RECENT, recentModel } from "../models/recent.model";
import { fileModel } from "../models/file.model";
import { HTTP_BAD_REQUEST } from "../constants/http_status";

export const downloadFiles = asyncHandler(async (req: any, res) => {
  console.log("Request received to download file");

  const { email, fileId } = req.file;
  const requestedFile = await fileModel.findById(fileId);
  if (!requestedFile) {
    res.status(HTTP_BAD_REQUEST).send({ message: "requested file not found" });
    return;
  }
  const filePath = path.join(__dirname, "..", requestedFile.path);
  console.log("Full file path:", filePath);

  const stat = fs.statSync(filePath);
  const total = stat.size;
  const newFile: RECENT = {
    id: "",
    userEmail: email as string,
    file: fileId as any,
    action: "Downloaded",
  };

  const head = {
    "Content-Length": total,
    "Content-Type": "application/octet-stream",
  };

  // console.log("Full file download:", head);
  const file = fs.createReadStream(filePath);
  res.writeHead(200, head);
  file.pipe(res);

  file.on("end", async () => {
    const newRecentFile = await recentModel.create(newFile);
    if (!newRecentFile) {
      console.log("failed to save download history");
    }
    console.log("File stream ended for full file download");
  });

  file.on("error", (err) => {
    console.error("Stream error:", err);
    res.status(500).send({ message: "Internal Server Error" });
  });
});
