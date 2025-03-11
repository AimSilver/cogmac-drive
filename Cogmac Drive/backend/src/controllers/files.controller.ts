import asyncHandler from "express-async-handler";
import { fileModel } from "../models/file.model";
import { HTTP_BAD_REQUEST } from "../constants/http_status";
import { RECENT, recentModel } from "../models/recent.model";
import { userMgmtModel } from "../models/user-management.model";
import path from "path";
import fs from "fs";

import { User } from "../models/user.model";

/* ......................................................................................
........................................................................................ */

// method for fetching manager and admin's drive files

// export const fetchingOwnFiles = asyncHandler(async (req, res) => {
//   const email = req.body;
//   const files = await fileModel.find({ uploadedBy: email, isDeleted: false });
//   if (!files) {
//     res.status(HTTP_BAD_REQUEST).send("user's drive is empty");
//   }
//   res.send(files);
// });

/* .........................................................................
....................................................................... */

//method for fetching all non deleted files for drive of  manager

export const managersDriveFilesFn = asyncHandler(async (req: any, res) => {
  console.log("req recieved for fetching manager all drive files");
  const { email } = req.user;
  const files = await fileModel.find({ uploadedBy: email, isTrashed: false });
  if (!files) {
    res.status(HTTP_BAD_REQUEST).send("No Files currently");
    return;
  }
  res.send(files);
});

/* ....................................................................................
........................................................................................ */

// method fo fetching starred files (impotant files),
// managers can only sarredfiles
export const fetchStarredFiles = asyncHandler(async (req: any, res) => {
  console.log("req recieved for starring files");
  const { email } = req.user;
  const starredfiles = await fileModel
    .find({ isStarred: true, isTrashed: false, uploadedBy: email })
    .sort({ createdAt: -1 });

  if (!starredfiles) {
    res.status(HTTP_BAD_REQUEST).send("No Starred files ");
    return;
  }
  res.send(starredfiles);
});

// remark -later i have to use admin and manager auth middleware for this

/* ..........................................................................
............................................................................... */

// method for renaming a file
// export const renamefile = asyncHandler(async (req, res) => {
//   const { newName, id } = req.body;
//   const file = await fileModel.findByIdAndUpdate(
//     id,

//     {
//       name: newName,
//     },
//     { new: true }
//   );
//   if (file) {
//     res.send(`File ${file.name} renamed to ${newName}`);
//   } else {
//     res.status(HTTP_BAD_REQUEST).send("File not found");
//   }
// });

/* ........................................................................................
........................................................................................ */

// method for viewing files

// export const viewFiles = asyncHandler(async (req, res) => {
//   const fileId = req.params;
//   const file = await fileModel.findById(fileId);
//   if (!file || file.isTrashed) {
//     res.status(HTTP_BAD_REQUEST).send("File not found!");
//   }

//   const filePath = file?.path;
//   res.send(filePath);
// });

// method for starrin files
export const starringFiles = asyncHandler(async (req: any, res) => {
  console.log("req recieved for starring file");
  const { email } = req.user;
  const fileId = req.query.fileId;
  if (!fileId) {
    res
      .status(HTTP_BAD_REQUEST)
      .send({ message: "Necessary credentials not found" });
  }
  const starredFile = await fileModel.findByIdAndUpdate(
    fileId,
    {
      isStarred: true,
    },
    { new: true, runValidators: true }
  );
  if (!starredFile) {
    res.status(HTTP_BAD_REQUEST).send({ message: "file not found " });
    return;
  }
  const newRecentFile: RECENT = {
    id: "",
    userEmail: email,
    file: starredFile.id,
    action: "Starred",
  };
  await recentModel.create(newRecentFile);
  res.send({ message: `file starred ${starredFile?.fileName}` });
});
// unstarring file
export const unStarringFiles = asyncHandler(async (req: any, res) => {
  console.log("req recieved for starring file");
  const { email } = req.user;
  const fileId = req.query.fileId;
  if (!fileId) {
    res
      .status(HTTP_BAD_REQUEST)
      .send({ message: "Necessary credentials not found" });
  }
  const unStarredFile = await fileModel.findByIdAndUpdate(
    fileId,
    {
      isStarred: false,
    },
    { new: true, runValidators: true }
  );
  if (!unStarredFile) {
    res.status(HTTP_BAD_REQUEST).send({ message: "file not found " });
    return;
  }
  const newRecentFile: RECENT = {
    id: "",
    userEmail: email,
    file: unStarredFile.id,
    action: "UnStarred",
  };
  await recentModel.create(newRecentFile);
  res.send({ message: `file unStarred ${unStarredFile.fileName}` });
});

// for managers changing files access type

export const changingFileAccessTypeFn = asyncHandler(async (req: any, res) => {
  console.log("req to change access of file ", req.body);
  console.log("req user", req.user);
  const { email } = req.user;
  const fileId = req.query.fileId;
  const { accessValue } = req.body;
  if (!fileId && !accessValue) {
    res
      .status(HTTP_BAD_REQUEST)
      .send({ message: "file id and acess value not found" });
    return;
  }

  console.log("reqr", fileId, accessValue);
  const updatedFile = await fileModel.findByIdAndUpdate(
    fileId,
    { access: accessValue.access_Type, access_dept: accessValue.access_dept },
    { new: true, runValidators: true }
  );

  if (!updatedFile) {
    res
      .status(HTTP_BAD_REQUEST)
      .send({ message: " cannot find file to update" });
    return;
  }
  const newRecentFile: RECENT = {
    id: "",
    userEmail: email,
    file: updatedFile.id,
    action: "Permission changed",
  };
  await recentModel.create(newRecentFile);
  res.send({
    message: `successfully changed files access type to ${updatedFile.access} and ${updatedFile.access_dept}`,
  });
});

// files for manager's department cards,those files have manager access
export const getDepartmentFilesWithManagerAccessfn = asyncHandler(
  async (req, res) => {
    const dept = req.query.dept as string;
    console.log(dept, req.query);

    const managers = await userMgmtModel
      .find({
        roles: { $elemMatch: { role: "Manager", dept: dept } },
      })
      .populate<{ userId: User }>("userId");

    console.log(managers, "manager");
    if (!managers.length) {
      res
        .status(HTTP_BAD_REQUEST)
        .send("No managers found for this department");
      return;
    }
    const FilesforDeptManager = await Promise.all(
      managers.map(async (manager) => {
        const managerFiles = await fileModel
          .find({
            uploadedBy: manager.userId.email,
            access: { $in: ["Manager", "Open"] },
            isTrashed: false,
          })
          .lean();
        return managerFiles;
      })
    );
    const flattenedDeptFilesForManager = FilesforDeptManager.flat();
    console.log("flattenedDept", flattenedDeptFilesForManager);
    res.send(flattenedDeptFilesForManager);
  }
);

// method to view file
export const viewVideoFilefn = asyncHandler(async (req: any, res) => {
  console.log("req recieve for viewing files ");
  const file = await fileModel.findById(req.file.fileId);
  if (!file) {
    res.status(404).send("File not found");
    return;
  }
  const filePath = path.join(__dirname, "..", file.path);
  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    if (start >= fileSize) {
      res
        .status(416)
        .send("Requested range not satisfiable\n" + start + " >= " + fileSize);
      return;
    }
    const chunksize = end - start + 1;
    const fileStream = fs.createReadStream(filePath, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": file.fileType,
    };
    res.writeHead(206, head);
    fileStream.pipe(res);
  } else {
    const head = { "Content-Length": fileSize, "Content-Type": file.fileType };
    res.writeHead(200, head);
    fs.createReadStream(filePath).pipe(res);
  }
});

export const viewFilefn = asyncHandler(async (req: any, res) => {
  console.log("req received for viewing files", req.file);
  const { fileId } = req.file;
  if (!fileId) {
    res.status(HTTP_BAD_REQUEST).send("File ID is missing");
    return;
  }
  const file = await fileModel.findById(fileId);
  if (!file) {
    res.status(HTTP_BAD_REQUEST).send("File not found");
    return;
  }
  const filePath = file.path;
  const contentType = file.fileType;
  res.setHeader("Content-Type", contentType);
  res.sendFile(filePath, { root: path.resolve(".") }, (err) => {
    if (err) {
      console.error("Error serving file:", err);
      if (!res.headersSent) {
        res.status(HTTP_BAD_REQUEST).send("Error serving file");
        return;
      }
    }
  });
});
