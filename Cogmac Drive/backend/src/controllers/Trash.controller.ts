import asyncHandler from "express-async-handler";
import { File, fileModel } from "../models/file.model";
import { HTTP_BAD_REQUEST } from "../constants/http_status";
import { RECENT, recentModel } from "../models/recent.model";
import path, { dirname } from "path";
import fs from "fs";
import fsPromise from "fs/promises";
import { file } from "googleapis/build/src/apis/file";

// /* ...............................................................................
// ................................................................................. */

// // method for fetching user's trash files

// export const trashedFiles = asyncHandler(async (req, res) => {
//   const email = req.body;
//   const trashFiles = await fileModel.find({
//     uploadedBy: email,
//     isDeleted: true,
//   });
//   if (!trashFiles) {
//     res.status(HTTP_BAD_REQUEST).send("User's Trash is empty");
//   }
//   res.send(trashFiles);
// });

// /* ..................................................................................
// ..................................................................................... */

// // method for fetching all trashed files

// method for fetching trash  files

export const fetchTrashFiles = asyncHandler(async (req: any, res) => {
  console.log("req recieved for getting trash files");
  const { email } = req.user;
  if (!email) {
    console.log("email not found");
    res.status(HTTP_BAD_REQUEST).send({ message: "email not found" });
    return;
  }

  const trashedFiles = await fileModel
    .find({ uploadedBy: email, isTrashed: true })
    .sort({ createdAt: -1 });

  if (!trashedFiles) {
    res.status(HTTP_BAD_REQUEST).send({ message: "No files in trash" });
  }
  console.log("trash files found", trashedFiles);
  res.send(trashedFiles);
});

// //remarks --later i need to use midlleware to authenticate only admin and manager

// /* ............................................................................
// ................................................................................. */

// //method for moving a file into trash

export const moveTotrashfn = asyncHandler(async (req: any, res) => {
  console.log("request recieving for moving a file to trash", req.query.fileId);
  const fileId = req.query.fileId;
  const { email } = req.user;

  if (!fileId) {
    res.status(HTTP_BAD_REQUEST).send({ message: "fileid not found" });
    return;
  }
  const trashedFile = await fileModel.findByIdAndUpdate(
    fileId,
    {
      isTrashed: true,
    },
    { new: true, runValidators: true }
  );
  if (!trashedFile) {
    res.status(HTTP_BAD_REQUEST).send({ message: "file not found" });
    return;
  }

  console.log(trashedFile, trashedFile.fileName, "trashed file");
  const newRecentFile: RECENT = {
    id: "",
    userEmail: email,
    file: trashedFile.id,
    action: "Trashed",
  };
  await recentModel.create(newRecentFile);
  res.send({
    message: `Succeffuly move to trash file-${trashedFile.fileName}`,
  });
});

// /* ...................................................................................
// ...................................................................................... */

// // method for restoring file
export const restoringFileFn = asyncHandler(async (req: any, res) => {
  console.log("req recieved to restore a file");
  const fileId = req.query.fileId;
  const { email } = req.user;
  if (!fileId) {
    res.status(HTTP_BAD_REQUEST).send({ message: "fileId missing" });
    return;
  }
  const restoredFile = await fileModel.findByIdAndUpdate(
    fileId,
    {
      isTrashed: false,
    },
    { new: true, runValidators: true }
  );
  if (!restoredFile) {
    res.status(HTTP_BAD_REQUEST).send({ message: "file not found" });
    return;
  }
  const newRecentFile: RECENT = {
    id: "",
    userEmail: email,
    file: restoredFile.id,
    action: "Restored",
  };
  await recentModel.create(newRecentFile);
  res.send({ message: "!file restored" });
});

//  method for deleting  file permanently

export const deleteFilePermanentlyfn = asyncHandler(async (req, res) => {
  console.log("req recieved for deleting file permanently");
  const fileId = req.query.fileId;
  const filePath = req.query.filePath;
  if (!fileId && !filePath) {
    res.status(HTTP_BAD_REQUEST).send({ messsage: "fileId not found" });
    return;
  }
  const fileLocation = path.join(__dirname, "..", filePath as string);
  console.log("filelocation", fileLocation);
  fs.unlink(fileLocation, async (err) => {
    if (err) {
      console.error("Error deleting file from storage:", err);
      res
        .status(HTTP_BAD_REQUEST)
        .send({ message: "Error deleting file from storage" });
      return;
    }
    const deletedFile = await fileModel.findByIdAndDelete(fileId);
    if (!deletedFile) {
      res.status(HTTP_BAD_REQUEST).send({ messsage: "file not found" });
      return;
    }
    res.send({ message: `file successfully deleted ${deletedFile?.fileName}` });
  });
});

// for deleting all selected files
// export const deleteAllSelectedFileFn = asyncHandler(async (req, res) => {
//   console.log("Request received to delete all selected files", req.body);

//   const { files } = req.body;
//   if (!files || !Array.isArray(files) || files.length === 0) {
//     res.status(400).send({ message: "No files to delete" });
//     return;
//   }

//   const errors: string[] = [];
//   const deletedFiles: string[] = [];

//   for (const file of files) {
//     const fileId = file.fileId;
//     const filePath = file.filePath;
//     const fileLocation = path.resolve(__dirname, "..", filePath);

//     try {
//       console.log("Deleting file at location:", fileLocation);

//       // Check if file exists and delete it
//       await fsPromise.access(fileLocation);
//       console.log("deleteing file at location", fileLocation);
//       await fsPromise.unlink(fileLocation);
//       const deletedFile = await fileModel.findByIdAndDelete(fileId);
//       if (!deletedFile) {
//         errors.push(
//           `Failed to delete file with ID ${fileId} from the database`
//         );
//       } else {
//         console.log("Deleted file:", deletedFile.fileName);
//         deletedFiles.push(deletedFile.fileName);
//       }
//     } catch (error: any) {
//       if (error.code === "ENOENT") {
//         console.log(
//           `File not found: ${fileLocation}. It may already be deleted.`
//         );
//       } else {
//         console.error("Error during file deletion:", error.message);
//         errors.push(`Error deleting file at ${fileLocation}: ${error.message}`);
//       }
//     }
//   }
//   if (errors.length > 0) {
//     res.status(HTTP_BAD_REQUEST).send({ message: `${errors.join(", ")}` });
//     return;
//   }

//   res.send({
//     message: `files successfully deleted ${deletedFiles.join(", ")}`,
//   });
// });
export const deleteAllSelectedFileFn = asyncHandler(async (req, res) => {
  console.log("Request received to delete all selected files", req.body);

  const { files } = req.body;

  if (!files || !Array.isArray(files) || files.length === 0) {
    res.status(400).send({ message: "No files to delete" });
    return;
  }

  // res.send({ message: `req recived for ${files.length}` });
  const errors = [];
  const deletedFiles = [];

  for (const file of files) {
    const fileId = file.fileId;
    const filePath = file.filePath;
    const fileLocation = path.resolve(__dirname, "..", filePath);

    try {
      console.log("Deleting file at location:", fileLocation);

      // Check if the file exists before trying to delete it
      await fsPromise.access(fileLocation);
      await fsPromise.unlink(fileLocation); // Use await to handle unlink asynchronously

      const deletedFile = await fileModel.findByIdAndDelete(fileId);
      if (!deletedFile) {
        errors.push(
          `Failed to delete file with ID ${fileId} from the database`
        );
      } else {
        console.log("Deleted file:", deletedFile.fileName);
        deletedFiles.push(deletedFile.fileName);
      }
    } catch (error: any) {
      // Improved error handling
      if (error.code === "ENOENT") {
        console.log(
          `File not found: ${fileLocation}. It may already be deleted.`
        );
      } else {
        console.error("Error during file deletion:", error.message);
        errors.push(`Error deleting file at ${fileLocation}: ${error.message}`);
      }
    }
  }

  if (errors.length > 0) {
    res.status(400).send({ message: `Errors occurred: ${errors.join(", ")}` });
    return;
  }

  res.send({
    message: "Files successfully deleted",
    deletedFiles,
  });
});
// method for restoring all selectedfiles
export const restoreAllSelcetedFiles = asyncHandler(async (req: any, res) => {
  console.log("req recieved for restoring selected files", req.body);
  const { files } = req.body;
  const { email } = req.user;
  if (!files || !Array.isArray(files) || files.length === 0) {
    res.status(HTTP_BAD_REQUEST).send({ message: "No files to restore" });
    return;
  }
  const errors: any = [];
  const restoredFiles: any = [];
  await Promise.all(
    files.map(async (file) => {
      const fileId = file.fileId;
      const restoredFile = await fileModel.findByIdAndUpdate(
        fileId,
        { isTrashed: false },
        { new: true, runValidators: true }
      );
      if (!restoredFile) {
        errors.push(`file not found with fileId${fileId}`);
        return;
      }
      restoredFiles.push(restoredFile.fileName);
      const newRecentFile: RECENT = {
        id: "",
        userEmail: email,
        file: restoredFile.id,
        action: "Restored",
      };
      await recentModel.create(newRecentFile);
    })
  );
  if (errors.length > 0) {
    res.status(400).send({ message: `Errors occurred: ${errors.join(", ")}` });
    return;
  }
  console.log("restored files successfully ", restoredFiles);
  res.send({
    message: "Files successfully restored",
    restoredFiles,
  });
});
