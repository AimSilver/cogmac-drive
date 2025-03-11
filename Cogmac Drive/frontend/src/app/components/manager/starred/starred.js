import { isoToDateAndTime } from "../../../Utils/functions.js";
import { getStarredFilesService } from "../../../Utils/services/getStarredFiles.js";
import { unStarringFileService } from "../../../Utils/services/unstarringFile.js";
import { downloadFileService } from "../../../Utils/services/downloadFile.js";
import { moveToTrashService } from "../../../Utils/services/moveToTrash.js";
import { viewFileService } from "../../../Utils/services/viewFiles.js";
import {
  viewFileModalBody,
  viewFileModalTitle,
  closeManagerViewFileModalBtn,
} from "../constants.js";

export async function starredContainerInitializer() {
  const starredContainerBody = document.getElementById(
    "starred-container-body"
  );
  starredContainerBody.innerHTML = "";
  const url = "/getStarredFiles";
  const { starredFiles } = await getStarredFilesService(url);
  await showStarredFilesInStarredNav(starredFiles);
  await downloadFile(starredFiles);
  await forUnStarringFile(starredFiles);
  await moveToTrash(starredFiles);
  await viewStarredFilesfn(starredFiles);
  await stopVideoStreaming(starredFiles);
}

async function showStarredFilesInStarredNav(starredFiles) {
  if (!starredFiles) {
    console.log("No starred files found");
  }
  starredFiles.forEach((file, fileIndex) => {
    const starredContainerBody = document.getElementById(
      "starred-container-body"
    );
    const { formattedDate } = isoToDateAndTime(file.updatedAt);
    starredContainerBody.innerHTML += `
            <div class="row file-row">
                <div class="col-sm-6 d-flex align-items-center" style="font-size:14px;overflow:hidden;" data-toggle="tooltip" data-placement="top" title="${file.fileName}">
                 ${file.fileName}
                 </div>
                <div class="col-sm-3 file-data" data-toggle="tooltip" data-placement="top" title="${file.uploadedBy}">${file.uploadedBy}</div>

                <div class="col-sm-2 file-data">${formattedDate}</div>

                <div class="col-sm-1">
                 <button class="btn btn-outline-light" id="ellipsis-btn-admin-home-${fileIndex}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" aria-hidden="true">
                    <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
                  </button>
              
                   <div class="dropdown-menu " aria-labelledby="ellipsis-btn-admin-home-${fileIndex}" >
                      <button class="dropdown-item  btn btn-sm" type="button" data-toggle="modal"  id="viewFiles-starredFile-btn-${fileIndex}" >
                       <i class="fa fa-eye" aria-hidden="true"></i>  View
                      </button>
                      <div class="hr" ></div>
                      <button class="dropdown-item btn btn-sm" type="button" id="downloadfile-admin-home-btn-${fileIndex}" >
                      <i class="fa fa-download" aria-hidden="true"></i> Download 
                      </button>
                      <div class="hr" ></div>
                      <button class="dropdown-item  btn btn-sm" type="button" id="unStarredfile-btn-${fileIndex}" >
                      <i class="fa-regular fa-star"></i> UnStarred
                      </button>
                       <div class="hr" ></div>
                      <button class="dropdown-item  btn btn-sm" type="button" data-toggle="modal" data-target="#admin-home-deleteConfirmationModal-${fileIndex}" id="deletefile-admin-home-btn-${fileIndex}" >
                      <i class="fa fa-trash" aria-hidden="true"></i> Move To Trash
                      </button>
                     
                    
                    </div>

                </div>
              </div>


              <!--                                modal for   confiming delete action                                 -->

                 <div class="modal fade" id="admin-home-deleteConfirmationModal-${fileIndex}" tabindex="-1" role="dialog" aria-labelledby="deletefile-admin-home-btn-${fileIndex}" aria-hidden="true">
                <div class="modal-dialog" role="document">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="adminhomedeleteConfirmationModalLabel-${fileIndex}">Confirm Deletion</h5>
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div class="modal-body">
                      <p class="lead">Are you sure you want to move this file to Trash?</p>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-dismiss="modal">No</button>
                      <button type="submit" class="btn btn-danger" id="admin-home-confirmDeleteButton-${fileIndex}" >Yes</button>
                    </div>
                  </div>
                </div>
              </div>
    
    `;
  });
}
// function for download file
async function downloadFile(allFiles) {
  allFiles.forEach((file, fileIndex) => {
    const filePath = file.path;
    const fileName = file.fileName;
    const fileId = file.id;
    const url = `/download?path=${encodeURIComponent(
      filePath
    )}&fileName=${encodeURIComponent(fileName)}&fileId=${fileId}`;
    const downloadBtn = document.getElementById(
      `downloadfile-admin-home-btn-${fileIndex}`
    );
    if (downloadBtn) {
      downloadBtn.addEventListener("click", async () => {
        await downloadFileService(url, fileName);
      });
    } else {
      console.log("no dowload btn found");
    }
  });
}
// function for download file
async function forUnStarringFile(allStarredFiles) {
  if (!allStarredFiles) {
    console.log("failed to fetch allfiles");
    return;
  }
  allStarredFiles.forEach(async (file, fileIndex) => {
    const unStarredBtn = document.getElementById(
      `unStarredfile-btn-${fileIndex}`
    );
    if (!unStarredBtn) {
      console.log("unstarred file button not found");
      return;
    }
    unStarredBtn.addEventListener("click", async () => {
      console.log("unstarred buton clicked");
      const fileId = file.id;
      const url = `/unstarringFile?fileId=${encodeURIComponent(fileId)}`;
      await unStarringFileService(url);
      await starredContainerInitializer();
    });
  });
}
// method for deleting file
async function moveToTrash(allFiles) {
  if (!allFiles) {
    console.log("files not found");
    return;
  }
  allFiles.forEach((file, fileIndex) => {
    const confirmdeleteFileBtn = document.getElementById(
      `admin-home-confirmDeleteButton-${fileIndex}`
    );
    if (!confirmdeleteFileBtn) {
      console.log("delete file btn not found");
      return;
    }
    const fileId = file.id;
    const url = `/moveToTrash?fileId=${encodeURIComponent(fileId)}`;
    confirmdeleteFileBtn.addEventListener("click", async () => {
      await moveToTrashService(url);
      $(`#admin-home-deleteConfirmationModal-${fileIndex}`).modal("hide");
      await starredContainerInitializer();
    });
  });
}

// function for viewing file
async function viewStarredFilesfn(allFiles) {
  allFiles.forEach((file, fileIndex) => {
    const viewFileBtn = document.getElementById(
      `viewFiles-starredFile-btn-${fileIndex}`
    );

    if (!viewFileBtn) {
      console.log("view file btn not found");
    }
    viewFileBtn.addEventListener("click", async () => {
      viewFileModalBody.innerHTML = "";
      const fileType = file.fileType;
      const fileId = file.id;
      const filePath = file.path;

      $(`#home-view-files-modal`).modal("show");
      viewFileModalTitle.innerText = `${file.fileName}`;
      await viewFileService(fileType, fileId, fileIndex, viewFileModalBody);
    });
  });
}
async function stopVideoStreaming(allFiles) {
  allFiles.forEach((file, fileIndex) => {
    closeManagerViewFileModalBtn.addEventListener("click", async () => {
      const video = document.getElementById(`videoPlayer-${fileIndex}`);
      if (video) {
        await video.pause();
        video.src = "";
        await video.load();
      }
    });
  });
}
