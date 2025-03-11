import { ChangeFileAccessTypeService } from "../../../Utils/services/changeFile_access.js";
import { downloadFileService } from "../../../Utils/services/downloadFile.js";
import { isoToDateAndTime } from "../../../Utils/functions.js";
import { getDepartmentsService } from "../../../Utils/services/getDepartments.js";
import { getAllManagerOwnDriveFilesService } from "../../../Utils/services/getManagerDriveFiles.js";
import { moveToTrashService } from "../../../Utils/services/moveToTrash.js";
import { starringFileService } from "../../../Utils/services/starringFile.js";
import { viewFileService } from "../../../Utils/services/viewFiles.js";
import {
  closeManagerViewFileModalBtn,
  viewFileModalBody,
  viewFileModalTitle,
} from "../constants.js";
import { trashContainerInitializer } from "../trash/trash.js";

export async function myDriveInitializer() {
  const { AllFiles } = await getAllManagerOwnDriveFilesService();
  console.log(AllFiles);
  if (!AllFiles) {
    console.log("failed to fetch all files in mydrive");
  }
  showMyDriveFiles(AllFiles);
  await downloadFile(AllFiles);
  await starringFilefn(AllFiles);

  await moveToTrash(AllFiles);
  await viewfilesfn(AllFiles);
  await stopVideoStreaming(AllFiles);
  toggleAccessSelectOptions(AllFiles);
  await getDepartmentlistAndSetInsideSelectDepartmentOptions(AllFiles);
  await changeAccessOfFile(AllFiles);
}

function showMyDriveFiles(allFiles) {
  const mydriveContainerBody = document.getElementById(
    "mydrive-container-body"
  );
  if (!allFiles && !mydriveContainerBody) {
    console.log(
      "All drive files not found for user or mydrivecontainer not found"
    );
  }
  mydriveContainerBody.innerHTML = "";
  allFiles.forEach(async (file, fileIndex) => {
    const isoFileModificationDate = file.updatedAt;
    const { formattedDate } = isoToDateAndTime(isoFileModificationDate);
    mydriveContainerBody.innerHTML += `

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
                <div class="col-sm-1 ">
                  <button class="btn btn-outline-light" id="dropdownMenu${fileIndex}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" aria-hidden="true">
                    <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
                  </button>

                  <div class="dropdown-menu " aria-labelledby="dropdownMenu${fileIndex}" >
                     <button class="dropdown-item  btn btn-sm" type="button" data-toggle="modal"  id="viewFiles-mydrive-btn-${fileIndex}" >
                       <i class="fa fa-eye" aria-hidden="true"></i>  View
                      </button>
                       <div class="hr" ></div>
                      <button class="dropdown-item btn btn-sm" type="button" id="downloadfile-mydrive-btn-${fileIndex}" >
                      <i class="fa fa-download" aria-hidden="true"></i> Download
                      </button>
                      <div class="hr" ></div>
                      <button class="dropdown-item  btn btn-sm" type="button" id="starredfile-mydrive-btn-${fileIndex}" >
                       <i class="fa fa-star" aria-hidden="true"></i> Starred
                      </button>
                      <div class="hr" ></div>
                      <button class="dropdown-item  btn btn-sm" type="button" data-toggle="modal" data-target="#mydrive-deleteConfirmationModal-${fileIndex}" id="deletefile-mydrive-btn-${fileIndex}" >
                       <i class="fa fa-trash" aria-hidden="true"></i> Move To Trash
                      </button>
                      <button class="dropdown-item  btn btn-sm" type="button" data-toggle="modal" data-target="#mydrive-manageAccess-${fileIndex}" id="manageAccess-mydrive-btn-${fileIndex}" >
                       <i class="fa fa-lock" aria-hidden="true"></i>  Access Type 
                      </button>
                     
                     
                    
                    </div>
                  </div>
             </div>
<!--                                modal for   confiming delete action                                 -->

                 <div class="modal fade" id="mydrive-deleteConfirmationModal-${fileIndex}" tabindex="-1" role="dialog" aria-labelledby="deletefile-mydrive-btn-${fileIndex}" aria-hidden="true">
                <div class="modal-dialog" role="document">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="mydrivedeleteConfirmationModalLabel-${fileIndex}">Confirm Deletion</h5>
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div class="modal-body">
                      <p class="lead">Are you sure you want to move this file to Trash?</p>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-dismiss="modal">No</button>
                      <button type="submit" class="btn btn-danger" id="mydrive-confirmDeleteButton-${fileIndex}" >Yes</button>
                    </div>
                  </div>
                </div>
              </div>


              <!--  modal for changig file access -->

              <div class="modal fade" id="mydrive-manageAccess-${fileIndex}" tabindex="-1" role="dialog" aria-labelledby="manageAccess-mydrive-btn-${fileIndex}" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel-${fileIndex}">File Access Permission</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
      <div class="d-flex justify-content-around align-items-center">
  <div class="btn  btn-outline-primary" id="select-permissionType-${fileIndex}">Permission Type</div>
<div class="btn  btn-outline-primary" id="select-department-btn-${fileIndex}">Departmental</div>
</div>
      <div class="form-group mt-4 " style="display:none" id="select-permissionTYpe-${fileIndex}">
       
        <select class="form-select btn btn-sm btn-block btn-primary access-select-menu" id="file-access-select-menu-permissionType-${fileIndex}" >
  
  <option selected value="Restricted">Restricted</option>
  <option value="Manager">Manager</option>
  <option value="Viewer">Viewer</option>
  <option value="Open">Open</option>

</select></div>
  


 <div class="form-group mt-4" id="select-department-${fileIndex}" style="display:none">
              
              <select
                name="department"
                class="form-select btn btn-sm btn-block btn-primary access-select-menu"
                id="file-access-select-menu-dept-${fileIndex}"
              >
                
                
              </select>
            </div> 
      </div>
      
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary" id=file-access-saveBtn-${fileIndex}>Save changes</button>
      </div>
    </div>
  </div>
</div>
                  `;
    const button = document.getElementById(
      `starredfile-mydrive-btn-${fileIndex}`
    );
    if (file.isStarred) {
      button.setAttribute("disabled", "disabled");
    } else {
      console.log("starred button not found");
    }
  });
}

// function for setting departments
async function getDepartmentlistAndSetInsideSelectDepartmentOptions(allFiles) {
  const url = "/manager/getdepartments";
  const { departments } = await getDepartmentsService(url);
  if (!departments) {
    console.log("no departments found");
    return;
  }
  console.log(departments, "department lists");
  allFiles.forEach(async (file, fileIndex) => {
    const departmentSelectElement = document.getElementById(
      `file-access-select-menu-dept-${fileIndex}`
    );
    if (!departmentSelectElement) {
      console.log("no department select elemet found");
      return;
    }
    let html;
    departmentSelectElement.innerHTML = "";
    html += `<option value="none">None</option>`;
    departments.forEach((dept, index) => {
      html += `
      
      <option value="${dept.name}">${dept.name}</option>
      `;
    });
    departmentSelectElement.innerHTML += html;
  });
}

//function for toggling access type buttons

function toggleAccessSelectOptions(allFiles) {
  allFiles.forEach((file, fileIndex) => {
    const btnForPermissionType = document.getElementById(
      `select-permissionType-${fileIndex}`
    );
    const btnForDepartmental = document.getElementById(
      `select-department-btn-${fileIndex}`
    );
    const selectDepartmentsDiv = document.getElementById(
      `select-department-${fileIndex}`
    );
    const selectPermissionTypeDiv = document.getElementById(
      `select-permissionTYpe-${fileIndex}`
    );
    if (!btnForDepartmental && !btnForPermissionType) {
      console.log("access type sleect btn not found");
      return;
    }
    btnForDepartmental.addEventListener("click", () => {
      selectDepartmentsDiv.style.display = "block";
      selectPermissionTypeDiv.style.display = "none";
    });
    btnForPermissionType.addEventListener("click", () => {
      selectDepartmentsDiv.style.display = "none";
      selectPermissionTypeDiv.style.display = "block";
    });
  });
}
// download a file
async function downloadFile(allFiles) {
  allFiles.forEach((file, fileIndex) => {
    const fileName = file.fileName;
    const fileId = file.id;
    const url = "/download";
    const downloadBtn = document.getElementById(
      `downloadfile-mydrive-btn-${fileIndex}`
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
// starring a file
async function starringFilefn(allFiles) {
  if (!allFiles) {
    console.log("failed to fetch allfiles");
    return;
  }
  allFiles.forEach(async (file, fileIndex) => {
    const starredBtn = document.getElementById(
      `starredfile-mydrive-btn-${fileIndex}`
    );
    if (!starredBtn) {
      console.log("starred file button not found");
      return;
    }
    starredBtn.addEventListener("click", async () => {
      console.log("starred buton clicked");
      const fileId = file.id;
      const url = `/starringFile?fileId=${encodeURIComponent(fileId)}`;
      await starringFileService(url);
      await myDriveInitializer();
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
      `mydrive-confirmDeleteButton-${fileIndex}`
    );
    if (!confirmdeleteFileBtn) {
      console.log("delete file btn not found");
      return;
    }
    const fileId = file.id;
    const url = `/moveToTrash?fileId=${encodeURIComponent(fileId)}`;
    confirmdeleteFileBtn.addEventListener(
      "click",
      async () => {
        await moveToTrashService(url);
        $(`#mydrive-deleteConfirmationModal-${fileIndex}`).modal("hide");
        await trashContainerInitializer();
        await myDriveInitializer();
      },
      { once: true }
    );
  });
}
// changing permission to file
async function changeAccessOfFile(allFiles) {
  if (!allFiles) {
    console.log("cannot find allfiles");
  }
  allFiles.forEach((file, fileIndex) => {
    const fileAccessSaveBtn = document.getElementById(
      `file-access-saveBtn-${fileIndex}`
    );
    const fileAccessSelectMenu = document.getElementById(
      `file-access-select-menu-permissionType-${fileIndex}`
    );
    const deptAccessSelectMenu = document.getElementById(
      `file-access-select-menu-dept-${fileIndex}`
    );
    const selectDepartmentsDiv = document.getElementById(
      `select-department-${fileIndex}`
    );
    const selectPermissionTypeDiv = document.getElementById(
      `select-permissionTYpe-${fileIndex}`
    );
    if (!fileAccessSaveBtn && !fileAccessSelectMenu) {
      console.log("file access btn and menu not found");
      return;
    }
    fileAccessSaveBtn.addEventListener("click", async () => {
      let accessValue;
      if (
        selectDepartmentsDiv.style.display === "none" &&
        selectPermissionTypeDiv.style.display === "block"
      ) {
        accessValue = { access_Type: fileAccessSelectMenu.value };
      } else if (
        selectDepartmentsDiv.style.display === "block" &&
        selectPermissionTypeDiv.style.display === "none"
      ) {
        accessValue = { access_dept: deptAccessSelectMenu.value };
      } else {
        console.log("no access type found");
      }

      console.log(accessValue, "access type");
      if (!accessValue) {
        console.log("file access type not set");
        return;
      }
      const fileId = file.id;
      const url = `/changeFileAccess?fileId=${encodeURIComponent(fileId)}`;
      await ChangeFileAccessTypeService(url, { accessValue });
      $(`#mydrive-manageAccess-${fileIndex}`).modal("hide");
    });
  });
}
// method for viewingfiles
async function viewfilesfn(allFiles) {
  allFiles.forEach((file, fileIndex) => {
    const viewFileBtn = document.getElementById(
      `viewFiles-mydrive-btn-${fileIndex}`
    );

    if (!viewFileBtn) {
      console.log("view file btn not found");
    }
    viewFileBtn.addEventListener("click", async () => {
      viewFileModalBody.innerHTML = "";
      const fileType = file.fileType;
      const fileId = file.id;

      $(`#home-view-files-modal`).modal("show");
      viewFileModalTitle.innerText = `${file.fileName}`;
      await viewFileService(fileType, fileId, fileIndex, viewFileModalBody);
    });
  });
}
// method for stoping videos when user clickout of the view page
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
