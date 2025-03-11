import express from "express";
import authMid from "../middlewares/auth.mid";
import * as trashController from "../controllers/Trash.controller";
import managerMid from "../middlewares/manager.mid";

const router = express.Router();

router.get("/getTrashFiles", authMid, trashController.fetchTrashFiles);
router.patch("/moveToTrash", authMid, trashController.moveTotrashfn);
router.patch("/restoreFile", authMid, trashController.restoringFileFn);
router.delete(
  "/deleteFilePermanently",
  authMid,
  managerMid,

  trashController.deleteFilePermanentlyfn
);
export default router;
