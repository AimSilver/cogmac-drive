import { isoToDateAndTime } from "../../../Utils/functions.js";
import { getRecentFilesService } from "../../../Utils/services/getRecentFiles.js";
// method for fetching recent files from database
export async function recentFilesInitiailizer() {
  const { recentFiles } = await getRecentFilesService();
  console.log(recentFiles);
  addRecentFilesToViewPort(recentFiles);
}

function addRecentFilesToViewPort(recentFiles) {
  if (!recentFiles) {
    return;
  }
  const recentfilesContainerBody = document.getElementById(
    "recent-files-container-body"
  );
  recentfilesContainerBody.innerHTML = "";
  recentFiles.forEach((file, fileIndex) => {
    const isoCreationTime = file?.file?.createdAt;
    const { formattedDate: createdDate, formattedTime: createdTime } =
      isoToDateAndTime(isoCreationTime);
    const { formattedDate: updatedDate, formattedTime: updatedTime } =
      isoToDateAndTime(file?.updatedAt);
    recentfilesContainerBody.innerHTML += `
              <div class="row file-row">
                <div class="col-sm-6 d-flex align-items-center" style="font-size:14px;overflow:hidden;" data-toggle="tooltip" data-placement="top" title="${file.file.fileName}">
                 ${file?.file?.fileName}
                 </div>
                <div class="col-sm-3 file-data" data-toggle="tooltip" data-placement="top" title="${file.userEmail}">${file.file.uploadedBy}</div>

                <div class="col-sm-2 file-data">${file?.file?.size}</div>

                <div class="col-sm-1">
                <button class="btn btn-outline-light" id="dropdownMenu-btn-recent-${fileIndex}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" aria-hidden="true">
                    <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
                  </button>

                  <div class="dropdown-menu " aria-labelledby="dropdownMenu-btn-recent-${fileIndex}" >
                      <button class="dropdown-item btn btn-sm" data-toggle="modal" data-target="#recent-fileinfo-modal-${fileIndex}" type="button" id="recent-file-info-btn-${fileIndex}" >
                       File info <i class="fa fa-info-circle" aria-hidden="true"></i>
                      </button>
                      <div class="hr" ></div>
                     
                
                   </div>
                   <div class="modal fade" id="recent-fileinfo-modal-${fileIndex}" tabindex="-1" role="dialog" aria-labelledby="recent-file-info-btn-${fileIndex}" aria-hidden="true" >
                  <div class="modal-dialog " role="document">
                  <div class="modal-content">
                   <div class="modal-header">
                   <h5 class="modal-title" id="recent-fileinfo-modal-${fileIndex}">info <i class="fa fa-info-circle" aria-hidden="true"></i></h5>
                   <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                     <span aria-hidden="true">&times;</span>
                    </button>
                   </div>
                   <div class="modal-body">
                   
                  <div class="d-flex mt-2">
                  <h6>File Created at :</h6><span style="font-size:14px">&nbsp; ${createdTime} on ${createdDate}
                  </span>
                  </div>
                 <div class="hr mt-1" ></div>
                  <div class="d-flex mt-2">
                  <h6>File ${file?.action} at :</h6><span style="font-size:14px">&nbsp; ${updatedTime} on ${updatedDate}
                  </span>
                  </div>
                 <div class="hr mt-1" ></div>

                  <div class="d-flex mt-2">
                  <h6>${file?.action} By :</h6><span style="font-size:14px">&nbsp; ${file?.userEmail}
                  </span>
                  </div>
                 <div class="hr mt-1" ></div>
                   <div class="d-flex mt-2">
                  <h6>Type :</h6><span style="font-size:14px">&nbsp; ${file?.file?.fileType}
                  </span>
                  </div>
                 <div class="hr mt-1" ></div>
                   <div class="d-flex mt-2">
                  <h6>Size :</h6><span style="font-size:14px">&nbsp; ${file?.file?.size}
                  </span>
                  </div>
                 <div class="hr mt-1" ></div>
                   <div class="d-flex mt-2">
                  <h6>Access_Type :</h6><span style="font-size:14px">&nbsp; ${file?.file?.access}
                  </span>
                  </div>
                  <div class="hr mt-1" ></div>
                   <div class="d-flex mt-2">
                  <h6>Access_Dept :</h6><span style="font-size:14px">&nbsp; ${file?.file?.access_dept}
                  </span>
                  </div>
                   </div>
                   </div>
                   </div>
                 </div>
                    
                 

                </div>
              </div>
    `;
  });
}
