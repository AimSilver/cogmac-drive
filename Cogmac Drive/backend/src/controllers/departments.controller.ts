import asyncHandler from "express-async-handler";
import { Dept, deptModel } from "../models/department.model";
import { HTTP_BAD_REQUEST } from "../constants/http_status";

//method for fetching department list
export const getDepartments = asyncHandler(async (req, res) => {
  const Departments = await deptModel.find({});
  if (!Departments) {
    res.status(HTTP_BAD_REQUEST).send({ message: "No Departments are Found" });
    return;
  }
  res.send(Departments);
});
