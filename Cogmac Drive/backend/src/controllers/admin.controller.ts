import dotenv from "dotenv";
dotenv.config();

import asyncHandler from "express-async-handler";
import path, { dirname } from "path";
import fs from "fs";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator";
import { User, userModel } from "../models/user.model";
import { Auth, authModel } from "../models/auth.model";
import { HTTP_BAD_REQUEST } from "../constants/http_status";
import { USER_MGMT, userMgmtModel } from "../models/user-management.model";
import { Dept, deptModel } from "../models/department.model";
import { roleModel, Roles } from "../models/roles.model";
import mongoose from "mongoose";
import { fileModel } from "../models/file.model";

/* .............................................................................
................................................................................ */

//method for creating users
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, department } = req.body;
  console.log(req.body);
  if (!name || !email || !password || !role || !department) {
    res.status(HTTP_BAD_REQUEST).send({ message: "All fields are required" });
    return;
  }
  const sanitizedUsername = validator.trim(validator.escape(name));
  const sanitizedEmail = validator.trim(validator.escape(email));
  const sanitizedPassword = validator.trim(validator.escape(password));
  const sanitizedRole = validator.trim(validator.escape(role));
  const sanitizedDept = validator.trim(validator.escape(department));
  if (!validator.isEmail(sanitizedEmail)) {
    res.status(HTTP_BAD_REQUEST).send({ message: "Invalid email address" });
    return;
  }
  if (sanitizedPassword.length < 8) {
    res
      .status(HTTP_BAD_REQUEST)
      .send({ message: "Password must be at least 8 characters long" });
    return;
  }
  if (!sanitizedUsername || sanitizedUsername.length === 0) {
    res.status(HTTP_BAD_REQUEST).send({ message: "Username is required" });
    return;
  }
  if (!sanitizedRole || sanitizedRole.length === 0) {
    res.status(HTTP_BAD_REQUEST).send({ message: "Role is required" });
    return;
  }
  if (!sanitizedDept || sanitizedDept.length === 0) {
    res.status(HTTP_BAD_REQUEST).send({ message: "Department is required" });
    return;
  }

  const auth = await authModel.findOne({
    email: sanitizedEmail,
  });
  const user = await userModel.findOne({
    email: sanitizedEmail,
  });

  if (auth && user) {
    res.status(HTTP_BAD_REQUEST).send({ message: "User already existed" });
  } else {
    const encryptedPassword = await bcrypt.hash(sanitizedPassword, 10);
    const newAuth: Auth = {
      id: "",
      email: sanitizedEmail,
      password: encryptedPassword,
      isAdmin: false,
      isManager: false,
    };
    const newUser: User = {
      id: "",
      name: sanitizedUsername,
      email: sanitizedEmail,
    };
    const dbAuth = await authModel.create(newAuth);
    const dbUser = await userModel.create(newUser);
    if (dbAuth && dbUser) {
      const userId = dbUser.id;
      const newUserMgmt: USER_MGMT = {
        id: "",
        roles: [
          {
            _id: new mongoose.Types.ObjectId(),
            role: sanitizedRole,
            dept: sanitizedDept,
          },
        ],

        userId: userId,
        isActive: false,
        isOnline: false,
      };

      await userMgmtModel.create(newUserMgmt);
    } else {
      res
        .status(HTTP_BAD_REQUEST)
        .send({ message: "User registration failed" });
    }

    res.send({ message: "User Succefully registered" });
  }
});

/* ..............................................................................
.............................................................................. */

//method for creating new Departments
export const createNewDept = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    res.status(400).json({ message: "Name is required" });
    return;
  }
  const newDept: Dept = {
    id: "",
    name: name,
  };
  const dbdepartment = deptModel.create(newDept);
  if (!dbdepartment) {
    res.status(HTTP_BAD_REQUEST).send({
      message: "failed to create new department",
    });
    return;
  }
  res.send({ message: `New department created successfully ( ${name} ) ` });
});

/* ......................................................................................
...................................................................................... */

// method for creating new roles
export const createNewRole = asyncHandler(async (req, res) => {
  console.log("req recieved for adding new role", req.body);
  const { newRole } = req.body;
  if (!newRole || newRole === "") {
    res.status(HTTP_BAD_REQUEST).send({ message: "New Role field empty" });
    return;
  }
  const Role: Roles = {
    id: "",
    name: newRole,
  };
  const Roledb = await roleModel.findOne({ name: newRole });
  if (Roledb) {
    res.status(HTTP_BAD_REQUEST).send({ message: "role already exist" });
    return;
  }
  const dbRole = await roleModel.create(Role);
  console.log("newrole-", dbRole.name);
  if (!dbRole) {
    res.status(HTTP_BAD_REQUEST).send({ message: "failed to create new role" });
    return;
  }

  res.send({ message: `Successfully created new role ${dbRole.name}` });
});

/* ............................................................................................
...........................................................................................
 */

// method for fetchin all roles

export const getallRoles = asyncHandler(async (req, res) => {
  console.log("req,recieved for fetching all roles");
  const roles = await roleModel.find({});
  if (!roles) {
    res.status(HTTP_BAD_REQUEST).send({ message: "roles are not available" });
    return;
  }
  res.send(roles);
});

// method for deleting a role

export const deleteRolefn = asyncHandler(async (req, res) => {
  console.log("recieved req to delete a role");
  console.log(req.params);
  const { id } = req.params;
  if (!id) {
    res.status(HTTP_BAD_REQUEST).send({ message: "!Request Id not found" });
  }
  const deletedRole = await roleModel.findByIdAndDelete(id);
  if (!deletedRole) {
    res.status(HTTP_BAD_REQUEST).send({ message: "Role not found" });
    return;
  }
  console.log(deletedRole);
  res.send({ message: `Role deleted successfully ${deletedRole?.name}` });
});

/* ................................................................................................................
.......................................................................................... */

//method for deleting departments

export const deleteDepartments = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deletedDept = await deptModel.findByIdAndDelete(id);
  if (!deletedDept) {
    res.status(404).json({ message: "Department not found" });
    return;
  }
  res.send({ message: "Department deleted successfully" });
});

// method for fetchig all  users details

export const getAllUsersDetails = asyncHandler(async (req, res) => {
  const userDetails = await userMgmtModel.find({}).populate("userId");
  if (!userDetails) {
    res.status(HTTP_BAD_REQUEST).send({ message: "No Users details found" });
    return;
  }

  res.send(userDetails);
});

//method for editing users dept and role

export const editUserRoleDepartment = asyncHandler(async (req, res) => {
  console.log("req,recieved for changing user role and department :", req.body);

  const { role, department, Id } = req.body;

  if (!role || !department || !Id) {
    res.status(HTTP_BAD_REQUEST).send({ message: "All fields are required" });
    return;
  }
  const sanitizedRole = validator.trim(validator.escape(role));
  const sanitizedDept = validator.trim(validator.escape(department));
  const selectedUser = await userMgmtModel.findById(Id);
  if (!selectedUser) {
    res.status(HTTP_BAD_REQUEST).send({ message: "User not found" });
    return;
  }
  const existingRoleDept = selectedUser.roles.find(
    (role) => role.role === sanitizedRole && role.dept === sanitizedDept
  );
  if (existingRoleDept) {
    res
      .status(HTTP_BAD_REQUEST)
      .send({ message: "Role and department already exist for the user" });
    return;
  }

  selectedUser.roles.push({
    _id: new mongoose.Types.ObjectId(),
    role: sanitizedRole,
    dept: sanitizedDept,
  });
  await selectedUser.save();

  res.send({ message: "User updated successfully", user: selectedUser });
});

//method for deleting a user
export const deleteUser = asyncHandler(async (req, res) => {
  console.log("Delete user request received:", req.query);
  const { deleteRoleId, userId, email } = req.query;
  try {
    const user = await authModel.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    if (user.isAdmin) {
      res.status(403).json({ message: "Cannot delete an psuedo admin " });
      return;
    }
    const deletedRole = await userMgmtModel.findByIdAndDelete(deleteRoleId);
    const deletedUser = await userModel.findByIdAndDelete(userId);
    const deletedUserAuth = await authModel.deleteOne({ email });
    if (!deletedRole || !deletedUser || deletedUserAuth.deletedCount === 0) {
      res.status(404).json({ message: "User Records not Found" });
      return;
    }
    res.send({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error during deletion:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// method for toggling user block unblock

export const toggleBlock = asyncHandler(async (req, res) => {
  console.log("Request received to toggle block/unblock");
  const { Id } = req.body;
  console.log("Toggled user email:", Id);

  if (!Id) {
    console.log("No email found for toggling user block/unblock");
    res.status(HTTP_BAD_REQUEST).json({ message: "Email is required" });
    return;
  }

  const toggledUser = await userMgmtModel.findById(Id);
  if (!toggledUser) {
    res.status(HTTP_BAD_REQUEST).json({ message: "User not found" });
    return;
  }

  console.log("Toggled user found");
  toggledUser.isActive = !toggledUser.isActive; // Assuming you are toggling the isActive field
  await toggledUser.save();

  if (toggledUser.isActive) {
    res.json({ message: "Successfully unblocked user" });
    return;
  } else {
    res.json({ message: "Successfully blocked user" });
    return;
  }
});

// delete users selected  role/department

export const deleteUserRoleDept = asyncHandler(async (req, res) => {
  console.log("req recieve for deleting users selected role/dept ", req.query);
  const { userId, roleId } = req.query;
  const requestedUser = await userMgmtModel.findById(userId);
  if (!requestedUser) {
    res.status(HTTP_BAD_REQUEST).send({ message: "user not found" });
  }
  requestedUser!.roles = requestedUser!.roles.filter(
    (role) => role._id.toString() !== roleId
  );
  await requestedUser?.save();
  res.send({ message: "Succefully removed selected role/department" });
});

//generating token for registraion

const generateTokenResponse = (auth: Auth) => {
  const token = jwt.sign(
    {
      email: auth.email,
      isAdmin: auth.isAdmin,
      isManager: auth.isManager,
    },
    process.env.JWT_SECRET || "fallback-sercret-key",
    {
      expiresIn: "1hr",
    }
  );
  return {
    email: auth.email,
    isAdmin: auth.isAdmin,
    isManager: auth.isManager,
    token: token,
  };
};
