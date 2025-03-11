import express from "express";
import * as adminController from "../controllers/admin.controller";
import adminMid from "../middlewares/admin.mid";
import authMid from "../middlewares/auth.mid";
const router = express.Router();

router.post("/newdept", authMid, adminMid, adminController.createNewDept);

router.delete(
  "/deletedept/:id",
  authMid,
  adminMid,
  adminController.deleteDepartments
);
router.post("/registration", authMid, adminMid, adminController.registerUser);
router.get("/getUsers", authMid, adminMid, adminController.getAllUsersDetails);
router.post(
  "/userRoleManagement",
  authMid,
  adminMid,
  adminController.editUserRoleDepartment
);

router.delete("/deleteUser", authMid, adminMid, adminController.deleteUser);

router.post("/addNewRole", authMid, adminMid, adminController.createNewRole);
router.get("/getAllRoles", authMid, adminMid, adminController.getallRoles);
router.delete(
  "/deleteRole/:id",
  authMid,
  adminMid,
  adminController.deleteRolefn
);
router.delete(
  "/deleteUserRole",
  authMid,
  adminMid,
  adminController.deleteUserRoleDept
);
router.patch("/toggleBlock", authMid, adminMid, adminController.toggleBlock);
export default router;
