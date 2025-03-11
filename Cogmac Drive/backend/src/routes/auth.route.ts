import express from "express";
import * as authcontroller from "../controllers/auth.controller";
import authMid from "../middlewares/auth.mid";

const router = express.Router();

router.post("/login", authcontroller.signin);
router.post("/googleSignin", authcontroller.googleSignin);
router.put("/updateUserDetails", authMid, authcontroller.updateAccountDetails);
router.put("/renameUser", authMid, authcontroller.renameUser);
router.post(
  "/getDownloadToken",
  authMid,
  authcontroller.requestForDownloadToken
);
router.post(
  "/getViewFileToken",
  authMid,
  authcontroller.requestForViewFileToken
);
export default router;
