import asyncHandler from "express-async-handler";
import { Request } from "express";
import multer from "multer";
import fs from "fs";
import { File, fileModel } from "../models/file.model";
import { HTTP_BAD_REQUEST } from "../constants/http_status";
import { RECENT, recentModel } from "../models/recent.model";
import path from "path";

const storage = multer.diskStorage({
  destination: (req: any, file, cb) => {
    const { userId } = req.user;
    if (!userId) {
      console.error("userId is missing");

      return;
    }

    const userDir = `./uploads/${userId}`;
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }

    const uploadDir = `${userDir}/`;
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const fileExtension = path.extname(file.originalname); //extracting file extension
    const baseName = path.basename(file.originalname, fileExtension); //extracting filename without extension
    const uniqueFileName = `${baseName}_${timestamp}${fileExtension}`; //creating unique name for file
    cb(null, uniqueFileName);
  },
});

export const upload = multer({ storage });

// method for uploading files
export const uploadFilesFunction = asyncHandler(async (req: any, res) => {
  console.log("req recieved to upload file", req.body);
  const { email } = req.user;
  const { file } = req.body;
  const filePath = req.file!.path;
  const fileName = req.file!.originalname;
  const fileType = req.file!.mimetype;
  const Size = req.file!.size;
  const { fileSize } = formatFileSize(Size);
  if (!file && !email && !fileName && !filePath && !fileType) {
    res.status(HTTP_BAD_REQUEST).send({
      message: "Sufficient credentials or file not found to upload file",
    });
    return;
  }
  const newFile: File = {
    id: "",
    fileName: fileName,
    uploadedBy: email,
    size: fileSize,
    path: filePath,
    fileType: fileType,
    isStarred: false,
    isTrashed: false,
  };

  const createdFile = await fileModel.create(newFile);
  if (!createdFile) {
    res.status(HTTP_BAD_REQUEST).send({ message: "File upload Failed" });
    return;
  } else {
    const fileId = createdFile.id;
    console.log(fileId, "for file recently uploaded");

    const newRecentAction: RECENT = {
      id: "",
      file: fileId,
      userEmail: email,

      action: "Uploaded",
    };
    await recentModel.create(newRecentAction);
    res.send({ message: `File Succefully uploaded : ${createdFile.fileName}` });
  }
});

//function for formatting file sizing
function formatFileSize(bytes: number): { fileSize: string } {
  const sizes: string[] = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return { fileSize: "0 Bytes" };
  const i: number = Math.floor(Math.log(bytes) / Math.log(1024));
  const size: number = bytes / Math.pow(1024, i);
  const formattedSize: string = size.toFixed(2) + " " + sizes[i];
  return { fileSize: formattedSize };
}
