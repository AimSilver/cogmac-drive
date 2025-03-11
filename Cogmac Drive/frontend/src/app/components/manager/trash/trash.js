import {
  deleteAllSelectedFilesService,
  deleteFileService,
} from "../../../Utils/services/deleteFile.js";
import { isoToDateAndTime } from "../../../Utils/functions.js";
import { getTrashFilesService } from "../../../Utils/services/getTrashfiles.js";
import {
  restoreAllSelectedFilesService,
  restoreFileService,
} from "../../../Utils/services/restoreFiles.js";
import {
  confirmDeletionOfSelectedFiles,
  deleteRestoreSelectedFileContainer,
  restoreAllTrashBtn,
  selectAllTrashFiles,
} from "../constants.js";
import { eventListener } from "../../../Utils/methods/manageEventListenersMethod.js";
let selectAllTrashFilesHandler;
let confirmDeletionOfSelectedFilesHandler;
let restoreAllSelectedFilesHandeler;
let selectedFiles = []; // Local state for selected files

export async function trashContainerInitializer() {
  const trashContainerBody = document.getElementById("trash-container-body");

  selectAllTrashFiles.checked = false;
  trashContainerBody.innerHTML = "";
  const url = `/getTrashFiles`;
  const { trashFiles } = await getTrashFilesService(url);
  console.log(trashFiles);

  showTrashFiles(trashFiles);
  selectAllTrashFilesHandler = () => {
    selectMultipleTrashFiles(trashFiles, handleUpdatedFiles);
  };

  eventListener.remove(
    selectAllTrashFiles,
    "change",
    selectAllTrashFilesHandler
  );
  eventListener.remove(
    confirmDeletionOfSelectedFiles,
    "click",
    confirmDeletionOfSelectedFilesHandler
  );
  eventListener.remove(
    restoreAllTrashBtn,
    "click",
    restoreAllSelectedFilesHandeler
  );
  eventListener.add(selectAllTrashFiles, "change", selectAllTrashFilesHandler);
  await deleteAllSelectedTrashfn(trashFiles);
  await restoreAllselectedFiles();

  await restoreFiles(trashFiles);
  await deletefilePermanently(trashFiles);
}

// method to show all trash files in view port
function showTrashFiles(trashFiles) {
  if (!trashFiles) {
    console.log("no trashfiles found");
    return;
  }
  const trashContainerBody = document.getElementById("trash-container-body");
  trashContainerBody.innerHTML = "";
  trashFiles.forEach((file, fileIndex) => {
    const { formattedDate } = isoToDateAndTime(file.updatedAt);

    trashContainerBody.innerHTML += `
            <div class="row file-row">
                <div class="col-sm-4 d-flex align-items-center" style="font-size:14px;overflow:hidden;" data-toggle="tooltip" data-placement="top" title="${file.fileName}">
                <input type="checkbox" class="file-checkbox mr-2"  id="file-checkbox-${fileIndex}" data-file-id="${file.id}" style="display:none;">
                ${file.fileName}
                 </div>
                <div class="col-sm-3 file-data" data-toggle="tooltip" data-placement="top" title="${file.uploadedBy}">${file.uploadedBy}</div>

                <div class="col-sm-2 file-data">${formattedDate}</div>
                <div class="col-sm-2 file-data">${file.size}</div>

                <div class="col-sm-auto">
                 <button class="btn btn-outline-light" id="ellipsis-btn-trash-${fileIndex}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" aria-hidden="true">
                    <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
                  </button>
              
                   <div class="dropdown-menu " aria-labelledby="ellipsis-btn-trash-${fileIndex}" >
                     
                      <button class="dropdown-item  btn btn-sm" type="button" id="restore-btn-${fileIndex}" >
                      <i class="fas fa-trash-restore"></i> Restore
                      </button>
                       <div class="hr" ></div>
                      <button class="dropdown-item  btn btn-sm" type="button" data-toggle="modal" data-target="#trash-deleteConfirmationModal-${fileIndex}" id="deletefile-trash-btn-${fileIndex}" >
                      <i class="fa fa-trash" aria-hidden="true"></i> Delete permanently
                      </button>
                     
                    
                    </div>

                </div>
              </div>


              <!--                                modal for   confiming delete action                                 -->

                 <div class="modal fade" id="trash-deleteConfirmationModal-${fileIndex}" tabindex="-1" role="dialog" aria-labelledby="deletefile-trash-btn-${fileIndex}" aria-hidden="true">
                <div class="modal-dialog" role="document">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="trashConfirmationModalLabel-${fileIndex}">Confirm Deletion</h5>
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div class="modal-body">
                      <p class="lead">Are you sure you want to move this file to Trash?</p>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-dismiss="modal">No</button>
                      <button type="submit" class="btn btn-danger" id="trash-confirmDeleteButton-${fileIndex}" >Yes</button>
                    </div>
                  </div>
                </div>
              </div>
              
                                        
    
    `;
  });
}

//callbackfunction for selected files
const handleUpdatedFiles = (updatedSelectedFiles) => {
  selectedFiles = updatedSelectedFiles;
  console.log("updated files", selectedFiles);
};

// confirmdeletion event  handeler
confirmDeletionOfSelectedFilesHandler = async () => {
  console.log(selectedFiles, "delete selected files");
  const data = {
    files: selectedFiles,
  };

  await deleteAllSelectedFilesService(data);
  $("#trash-deleteConfirmationModal").modal("hide");
  selectedFiles = [];

  deleteRestoreSelectedFileContainer.style.display = "none";

  await trashContainerInitializer();
};

// restore all sleected files handelere
restoreAllSelectedFilesHandeler = async () => {
  const data = {
    files: selectedFiles,
  };
  await restoreAllSelectedFilesService(data);
  selectedFiles = [];

  deleteRestoreSelectedFileContainer.style.display = "none";

  await trashContainerInitializer();
};

// method for deleting  all selected  trash files
async function deleteAllSelectedTrashfn(files) {
  if (confirmDeletionOfSelectedFiles.click) {
    eventListener.add(
      confirmDeletionOfSelectedFiles,
      "click",
      confirmDeletionOfSelectedFilesHandler
    );
  }
}
async function restoreAllselectedFiles() {
  eventListener.add(
    restoreAllTrashBtn,
    "click",
    restoreAllSelectedFilesHandeler
  );
}
// method for restoring all selected trashfiles

// function for selecting multiple trash files
function selectMultipleTrashFiles(files, onUpdate) {
  const isChecked = selectAllTrashFiles.checked;
  let selectedFiles = isChecked
    ? files.map((file) => ({ fileId: file.id, filePath: file.path }))
    : [];

  if (!deleteRestoreSelectedFileContainer) {
    console.log("No delete restire file container found");
    return;
  }

  // Show or hide both buttons based on `isChecked`
  deleteRestoreSelectedFileContainer.style.display = isChecked
    ? "block"
    : "none";

  files.forEach((file, fileIndex) => {
    const filesCheckBoxes = document.getElementById(
      `file-checkbox-${fileIndex}`
    );
    const ellipsisBtn = document.getElementById(
      `ellipsis-btn-trash-${fileIndex}`
    );

    if (!filesCheckBoxes || !ellipsisBtn) {
      console.warn(`Missing elements for file index ${fileIndex}`);
      return;
    }

    // Toggle UI visibility
    filesCheckBoxes.checked = isChecked;
    filesCheckBoxes.style.display = isChecked ? "block" : "none";
    ellipsisBtn.style.display = isChecked ? "none" : "block";

    // Ensure a single event listener
    filesCheckBoxes.onchange = (e) => {
      if (e.target.checked) {
        if (!selectedFiles.some((f) => f.fileId === file.id)) {
          selectedFiles.push({ fileId: file.id, filePath: file.path });
        }
      } else {
        selectedFiles = selectedFiles.filter((f) => f.fileId !== file.id);
      }
      if (onUpdate) {
        onUpdate(selectedFiles);
      }
    };
  });
  if (onUpdate) {
    onUpdate(selectedFiles);
    console.log("Final selected files array:", selectedFiles);
  }
}

// method for deleting file peremannently

async function deletefilePermanently(allTrashFiles) {
  if (!allTrashFiles) {
    console.log("no file found in trash");
  }
  allTrashFiles.forEach((file, fileIndex) => {
    const confirmDeleteBtn = document.getElementById(
      `trash-confirmDeleteButton-${fileIndex}`
    );
    if (!confirmDeleteBtn) {
      console.log("no confirmdelete btn found for trash file");
    }
    const fileId = file.id;
    const filePath = file.path;

    confirmDeleteBtn.addEventListener(
      "click",
      async () => {
        const url = `/deleteFilePermanently?fileId=${encodeURIComponent(
          fileId
        )}&filePath=${encodeURIComponent(filePath)}`;
        await deleteFileService(url);
        $(`#trash-deleteConfirmationModal-${fileIndex}`).modal("hide");
        await trashContainerInitializer();
      },
      { once: true }
    );
  });
}

// method to restore files
async function restoreFiles(allTrashFiles) {
  if (!allTrashFiles) {
    console.log("no file found in trash");
  }
  allTrashFiles.forEach((file, fileIndex) => {
    const restoreFileBtn = document.getElementById(`restore-btn-${fileIndex}`);
    if (!restoreFileBtn) {
      console.log("restore  file btn not found");
      return;
    }
    const fileId = file.id;
    const url = `/restoreFile?fileId=${encodeURIComponent(fileId)}`;
    restoreFileBtn.addEventListener(
      "click",
      async () => {
        await restoreFileService(url);
        await trashContainerInitializer();
      },
      { once: true }
    );
  });
}
