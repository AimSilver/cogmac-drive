import { downloadFileService } from "../../../Utils/services/downloadFile.js";
import { isoToDateAndTime } from "../../../Utils/functions.js";
import { getDepartmentsService } from "../../../Utils/services/getDepartments.js";
import { getManagerFilesBasedOnDepartmentsService } from "../../../Utils/services/getmanagerFiles.js";
import { viewFileService } from "../../../Utils/services/viewFiles.js";
import {
  closeManagerViewFileModalBtn,
  managerDeptCardsTile,
  viewFileModalBody,
  viewFileModalTitle,
} from "../constants.js";

export async function ManagerhomeIntializer() {
  const deptCardRowConatiner = document.getElementById(
    "dept-card-row-conatiner"
  );
  deptCardRowConatiner.innerHTML = "";
  const url = "/getdept";
  const { departments } = await getDepartmentsService(url);
  if (!departments) {
    console.log("no departments found");
    return;
  }
  console.log(departments, "dept");
  showDepartmetnsInDepartmentCards(departments);
  await openDeptCardModals(departments);
}

function showDepartmetnsInDepartmentCards(departments) {
  const deptCardRowConatiner = document.getElementById(
    "dept-card-row-conatiner"
  );
  let html = "";
  departments.forEach((dept, index) => {
    const bgColors = [
      "bg-info ",
      "bg-success ",
      "bg-danger ",
      "bg-warning ",

      "bg-primary ",
      "bg-secondary ",
      "bg-dark ",
    ];

    if (index % 7 === 0) {
      if (index > 0) {
        html += "</div>";
      }
      html += '<div class="row ml-4">';
    }
    const colorClass = bgColors[index % bgColors.length];
    html += `  
            <div class="col dept-cards ${colorClass}" id="dept-card-modal-btn-${index}">
             <i class="fa fa-folder text-light"></i>
              <h6>${dept.name}</h6>
            </div>

     `;
  });
  if (departments.length % 7 !== 0) {
    html += "</div>";
  }
  deptCardRowConatiner.innerHTML = html;
}

async function openDeptCardModals(departments) {
  const deptcardBody = document.getElementById("deptcard-modal-card-body");

  departments.forEach((dept, index) => {
    const deptCardOpenBtn = document.getElementById(
      `dept-card-modal-btn-${index}`
    );
    if (!deptCardOpenBtn) {
      console.log("dept card open btn not found");
      return;
    }
    deptCardOpenBtn.addEventListener("click", async () => {
      managerDeptCardsTile.innerText = "";
      deptcardBody.innerHTML = "";
      managerDeptCardsTile.innerText += `${dept.name}`;

      console.log("dept card clicked");
      $("#dept-cards-modal").modal("show");

      const link = `/getdeptFilesForManagers?dept=${encodeURIComponent(
        dept.name
      )}`;
      const { managerFiles } = await getManagerFilesBasedOnDepartmentsService(
        link
      );
      console.log("managerfiles", managerFiles);
      showManagerFilesInTheirDepartments(managerFiles);
      await viewManagerHomeFilesfn(managerFiles);
      await downloadFileManagerHome(managerFiles);
      await stopVideoStreaming(managerFiles);
    });
  });
}
// to show manager files in dept cards
function showManagerFilesInTheirDepartments(managerFiles) {
  const deptcardBody = document.getElementById("deptcard-modal-card-body");
  deptcardBody.innerHTML = "";
  managerFiles.forEach((file, fileIndex) => {
    const { formattedDate } = isoToDateAndTime(file.updatedAt);
    deptcardBody.innerHTML += `
      
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
          <button class="btn btn-outline-light" id="dropdownMenuHome${fileIndex}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" aria-hidden="true">
            <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
          </button>

          <div class="dropdown-menu " aria-labelledby="dropdownMenuHome${fileIndex}" >
           <button class="dropdown-item  btn btn-sm" type="button" data-toggle="modal"  id="viewFiles-manager-home-btn-${fileIndex}" >
                       <i class="fa fa-eye" aria-hidden="true"></i>  View
          </button>
          <div class="hr" ></div>   
          <button class="dropdown-item btn btn-sm" type="button" id="downloadfile-manager-home-btn-${fileIndex}" >
              <i class="fa fa-download" aria-hidden="true"></i> Download
          </button>
             
              
             
             
            
            </div>
          </div>
     </div>
    
`;
  });
}

// method to download files
async function downloadFileManagerHome(allFiles) {
  allFiles.forEach((file, fileIndex) => {
    const fileName = file.fileName;
    const fileId = file._id;
    const url = "/download";
    const downloadBtn = document.getElementById(
      `downloadfile-manager-home-btn-${fileIndex}`
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
async function viewManagerHomeFilesfn(allFiles) {
  allFiles.forEach((file, fileIndex) => {
    const viewFileBtn = document.getElementById(
      `viewFiles-manager-home-btn-${fileIndex}`
    );

    if (!viewFileBtn) {
      console.log("view file btn not found");
      return;
    }
    viewFileBtn.addEventListener("click", async () => {
      viewFileModalBody.innerHTML = "";
      const fileType = file.fileType;
      const fileId = file._id;

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
        console.log("video stoped succesfully");
      }
    });
  });
}
