import express from "express";
import authMid from "../middlewares/auth.mid";
import * as fileController from "../controllers/files.controller";
import * as trashcontroller from "../controllers/Trash.controller";
import { getDepartments } from "../controllers/departments.controller";
import managerMid from "../middlewares/manager.mid";
const router = express.Router();
router.patch(
  "/changeFileAccess",
  authMid,
  managerMid,
  fileController.changingFileAccessTypeFn
);
// router.get("/getManagerFiles", authMid, fileController.getManagerFilesFn);
router.get(
  "/getdeptFilesForManagers",
  authMid,
  managerMid,
  fileController.getDepartmentFilesWithManagerAccessfn
);
router.get("/manager/getdepartments", authMid, managerMid, getDepartments);
router.post(
  "/deleteAllSelectedFiles",
  authMid,

  trashcontroller.deleteAllSelectedFileFn
);
router.patch(
  "/restoreAllSelectedFiles",
  authMid,
  managerMid,
  trashcontroller.restoreAllSelcetedFiles
);
export default router;
