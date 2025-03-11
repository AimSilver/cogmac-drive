import express from "express";
import authMid from "../middlewares/auth.mid";
import * as viewerController from "../controllers/viewers.controller";
import * as departmentController from "../controllers/departments.controller";
const router = express.Router();
router.get("/getActiveUsers", authMid, viewerController.getActiveuserfn);
router.get("/getdept", authMid, departmentController.getDepartments);
router.get("/getUserFiles", authMid, viewerController.getUserHomeFilesFn);
router.get(
  "/getViewerDepartmentFiles",
  authMid,
  viewerController.getDepartmentalFilesOfViewerFn
);

export default router;
