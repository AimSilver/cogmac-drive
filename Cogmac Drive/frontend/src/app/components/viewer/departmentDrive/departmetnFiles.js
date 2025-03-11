import { downloadFileService } from "../../../Utils/services/downloadFile.js";
import { isoToDateAndTime } from "../../../Utils/functions.js";
import { getFetchMethod } from "../../../Utils/methods/fetchMethods.js";
import { viewFileService } from "../../../Utils/services/viewFiles.js";

import {
  closeViewerViewFileModalBtn,
  departmentalDriveCardBody,
  viewerViewFileModalBody,
  viewerViewFileModalTitle,
} from "../constants.js";

export async function departmentFilesContainerIntializer() {
  const url = "/getViewerDepartmentFiles";
  const { data: departmentalFiles } = await getFetchMethod(url);
  if (!departmentalFiles) {
    console.log("failed to fetch viewers departmental files");
    return;
  }
  console.log("files", departmentalFiles);
  showViewersDpartmentalFilesFn(departmentalFiles);
  await viewViewerDepartmentalFilesfn(departmentalFiles);
  await downloadFileViewerDepartmental(departmentalFiles);
  await stopVideoStreaming(departmentalFiles);
}

function showViewersDpartmentalFilesFn(files) {
  departmentalDriveCardBody.innerHTML = "";
  files.forEach((file, fileIndex) => {
    const { formattedDate } = isoToDateAndTime(file.updatedAt);
    departmentalDriveCardBody.innerHTML += `
    <div class="row file-row">
        <div class="col-sm-4 d-flex align-items-center " style="font-size:14px;overflow:hidden" data-toggle="tooltip" data-placement="top" title="${file.fileName}">
         ${file.fileName}
        </div>
        <div class="col-sm-3 file-data" data-toggle="tooltip" data-placement="top" title="${file.uploadedBy}" >
         ${file.uploadedBy}
        </div>

        <div class="col-sm-2 file-data">${file.size}</div>
        <div class="col-sm-2 file-data">
          ${formattedDate}
        </div>
        <div class="col-sm-auto  ">
          <button class="btn btn-outline-light" id="dropdownMenuViewerDepartmental${fileIndex}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" aria-hidden="true">
            <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
          </button>

          <div class="dropdown-menu " aria-labelledby="dropdownMenuViewerDepartmental${fileIndex}" >
              <button class="dropdown-item  btn btn-sm" type="button" data-toggle="modal"  id="viewFiles-viewer-departmental-btn-${fileIndex}" >
                 <i class="fa fa-eye" aria-hidden="true"></i>  View
              </button>
               <div class="hr" ></div>
              <button class="dropdown-item btn btn-sm" type="button" id="downloadfile-viewer-departmental-btn-${fileIndex}" >
              <i class="fa fa-download" aria-hidden="true"></i> Download
              </button>
               <div class="hr" ></div>
                
             
              
             
             
            
            </div>
          </div>
     </div>
    
    
    
    
    
    `;
  });
}

// / method for downloading files

async function downloadFileViewerDepartmental(allFiles) {
  allFiles.forEach((file, fileIndex) => {
    const fileName = file.fileName;
    const fileId = file._id;
    const url = "/download";
    const downloadBtn = document.getElementById(
      `downloadfile-viewer-departmental-btn-${fileIndex}`
    );
    if (downloadBtn) {
      downloadBtn.addEventListener("click", async () => {
        await downloadFileService(url, fileName, fileId);
      });
    } else {
      console.log("no dowload btn found");
    }
  });
}
// method for viewing files
async function viewViewerDepartmentalFilesfn(allFiles) {
  allFiles.forEach((file, fileIndex) => {
    const viewFileBtn = document.getElementById(
      `viewFiles-viewer-departmental-btn-${fileIndex}`
    );

    if (!viewFileBtn) {
      console.log("view file btn not found");
      return;
    }
    viewFileBtn.addEventListener("click", async () => {
      viewerViewFileModalBody.innerHTML = "";
      const fileType = file.fileType;
      const fileId = file._id;

      $(`#viewer-view-files-modal`).modal("show");

      viewerViewFileModalTitle.innerText = `${file.fileName}`;

      await viewFileService(
        fileType,
        fileId,
        fileIndex,
        viewerViewFileModalBody
      );
    });
  });
}
// stop video streaming when viewfile modal is closed
async function stopVideoStreaming(allFiles) {
  allFiles.forEach((file, fileIndex) => {
    closeViewerViewFileModalBtn.addEventListener("click", async () => {
      const video = document.getElementById(`videoPlayer-${fileIndex}`);
      if (video) {
        await video.pause();
        video.src = "";
        await video.load();
        console.log("video stoped succesfully");
      }
    });
  });
}
