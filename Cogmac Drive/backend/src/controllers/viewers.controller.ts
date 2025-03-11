import asyncHandler from "express-async-handler";
import { HTTP_BAD_REQUEST } from "../constants/http_status";
import { userMgmtModel } from "../models/user-management.model";
import mongoose from "mongoose";
import { User } from "../models/user.model";
import { fileModel } from "../models/file.model";

export const getActiveuserfn = asyncHandler(async (req, res) => {
  console.log("req recieved for getting active users");
  const userId = req.query.userId as string;
  if (!userId) {
    res.status(HTTP_BAD_REQUEST).send({ message: "user id not found" });
    return;
  }
  const user = await userMgmtModel.findOne({
    userId: userId,
  });
  if (!user) {
    res.status(HTTP_BAD_REQUEST).send({ message: "user not found " });
    return;
  }
  console.log(user, "for active users");
  const userDepartments = user.roles
    .filter((role) => role.role === "Viewer")
    .map((role) => role.dept);

  console.log(userDepartments);
  const activeUsers = await userMgmtModel
    .find({
      "roles.role": "Viewer",
      "roles.dept": { $in: userDepartments },
      isOnline: "true",
    })
    .populate("userId");
  console.log(activeUsers, "activeusers");
  res.send({ activeUsers, userDepartments });
});

// export const getUserHomeFilesFn = asyncHandler(async (req: any, res) => {
//   console.log("req recieved for getting user files for user home ");
//   const { userId } = req.user;
//   if (!userId) {
//     res.status(HTTP_BAD_REQUEST).send({ message: "user id not found" });
//     return;
//   }
//   const user = await userMgmtModel.findOne({
//     userId: userId,
//   });
//   if (!user) {
//     res.status(HTTP_BAD_REQUEST).send({ message: "user not found " });
//     return;
//   }
//   console.log(user, "users");
//   const userDepartments = user.roles
//     .filter((role) => role.role === "Viewer")
//     .map((role) => role.dept);

//   console.log(userDepartments, "get user files");
//   const userManagers = await userMgmtModel
//     .find({
//       roles: {
//         $elemMatch: { role: "Manager", dept: { $in: userDepartments } },
//       },
//     })
//     .populate<{ userId: User }>("userId");
//   if (!userManagers) {
//     res
//       .status(HTTP_BAD_REQUEST)
//       .send({ message: "no managers found for the user" });
//     return;
//   }
//   console.log(userManagers, "user's dept managers");
//   userManagers.forEach((manager) => {
//     console.log("manger details", manager.userId.email);
//   });
//   const filesForViewer = await Promise.all(
//     userManagers.map(async (manager) => {
//       const managerFileForviewers = await fileModel
//         .find({
//           uploadedBy: manager.userId.email,
//           access: { $in: ["Viewer", "Open"] },
//         })
//         .lean();

//       return {
//         ...managerFileForviewers,
//         department: manager.roles.map((role) => role.dept),
//       };
//     })
//   );
//   const flattendFilesForViewers = filesForViewer.flat();
//   res.send({ userFiles: flattendFilesForViewers });
// });

export const getUserHomeFilesFn = asyncHandler(async (req: any, res) => {
  console.log("Request received for getting user files for user home");
  const { userId } = req.user;
  if (!userId) {
    res.status(HTTP_BAD_REQUEST).send({ message: "User ID not found" });
    return;
  }
  try {
    const user = await userMgmtModel.findOne({ userId });
    if (!user) {
      res.status(HTTP_BAD_REQUEST).send({ message: "User not found" });
      return;
    }
    console.log("User found:", user);
    const userDepartments = user.roles
      .filter((role) => role.role === "Viewer")
      .map((role) => role.dept);
    console.log("User departments:", userDepartments);
    const userManagers = await userMgmtModel
      .find({
        roles: {
          $elemMatch: { role: "Manager", dept: { $in: userDepartments } },
        },
      })
      .populate<{ userId: User }>("userId");
    if (!userManagers.length) {
      res
        .status(HTTP_BAD_REQUEST)
        .send({ message: "No managers found for the user" });
      return;
    }
    console.log("User's department managers:", userManagers);
    const filesForViewer = await Promise.all(
      userManagers.map(async (manager) => {
        const managerFilesForViewers = await fileModel
          .find({
            uploadedBy: manager.userId.email,
            access: { $in: ["Viewer", "Open"] },
            isTrashed: false,
          })
          .lean();
        return managerFilesForViewers.map((file) => ({
          ...file,
          department: manager.roles
            .filter((role) => role.role === "Manager")
            .map((role) => role.dept),
        }));
      })
    );
    const flattendFilesForViewers = filesForViewer.flat();
    console.log(flattendFilesForViewers, "viewer files");
    res.send({ userFiles: flattendFilesForViewers });
  } catch (error) {
    console.error("Error getting user files for home:", error);
    res
      .status(HTTP_BAD_REQUEST)
      .send({ message: "An error occurred while retrieving user files" });
  }
});

// method for getting departmental files of the viewer
export const getDepartmentalFilesOfViewerFn = asyncHandler(
  async (req: any, res) => {
    console.log("req recieved to fetch departmental files");
    const { userId } = req.user;
    if (!userId) {
      res.status(HTTP_BAD_REQUEST).send({ message: "User ID not found" });
      return;
    }
    const user = await userMgmtModel.findOne({ userId });
    if (!user) {
      res.status(HTTP_BAD_REQUEST).send({ message: "User not found" });
      return;
    }
    console.log("User found:", user);
    const userDepartments = user.roles
      .filter((role) => role.role === "Viewer")
      .map((role) => role.dept);
    console.log("User departments:", userDepartments);
    const departmentalFiles = await fileModel.find({
      access_dept: { $in: userDepartments },
      isTrashed: false,
    });
    if (!departmentalFiles) {
      res
        .status(HTTP_BAD_REQUEST)
        .send({ message: "departmentalfiles not available" });
      return;
    }
    console.log(departmentalFiles, "departmentalfiles");
    res.send(departmentalFiles);
  }
);
