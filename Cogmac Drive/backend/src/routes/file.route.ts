import express from "express";
import {
  upload,
  uploadFilesFunction,
} from "../controllers/fileUpload.controller";
import { downloadFiles } from "../controllers/downloadFiles.controller";
import * as recentFilesController from "../controllers/recent.controller";
import * as fileController from "../controllers/files.controller";
import authMid from "../middlewares/auth.mid";
import downloadMid from "../middlewares/download.mid";
import viewFileMid from "../middlewares/viewFile.mid";

const router = express.Router();

router.post(
  "/uploadFile",
  authMid,
  upload.single("file"),

  uploadFilesFunction
);
router.get(
  "/getRecentFiles",
  authMid,
  recentFilesController.fetchRecentFilesFn
);
router.get(
  "/getAllManagersOwnDriveFiles",
  authMid,
  fileController.managersDriveFilesFn
);
router.get("/download", downloadMid, downloadFiles);
router.patch("/starringFile", authMid, fileController.starringFiles);
router.get("/getStarredFiles", authMid, fileController.fetchStarredFiles);
router.patch("/unstarringFile", authMid, fileController.unStarringFiles);
router.get("/viewVideo", viewFileMid, fileController.viewVideoFilefn);
router.get("/viewFiles", viewFileMid, fileController.viewFilefn);

export default router;
