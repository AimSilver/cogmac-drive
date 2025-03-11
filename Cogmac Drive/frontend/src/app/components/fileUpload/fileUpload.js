import { getTokenUserFromLocalStorage } from "../../Utils/functions.js";
import { myDriveInitializer } from "../manager/myDrive/myDrive.js";
import { recentFilesInitiailizer } from "../manager/recent/recent.js";

export function uploadFileInitializer() {
  const { user, token } = getTokenUserFromLocalStorage();
  console.log(user);
  const fileUploadInput = document.getElementById("file-upload-input");
  const progressBarBtn = document.getElementById("upload-progress-btn");
  const drawer = document.getElementById("file-uploadProgress-drawer");
  const closeDrawerBtn = document.getElementById("close-drawer-btn");
  const xhrRequests = [];

  fileUploadInput.click();

  fileUploadInput.addEventListener("change", async (event) => {
    if (progressBarBtn && drawer && closeDrawerBtn) {
      toggleDrawer(drawer);
      progressBarBtn.addEventListener("click", () => {
        closedrawer(progressBarBtn, drawer);
      });
      closeDrawerBtn.addEventListener("click", () => {
        closedrawer(progressBarBtn, drawer);
      });

      console.log("progress bar drawer found");
    } else {
      console.log("cannot find progress bar");
      return;
    }

    const files = event.target.files;

    for (let i = 0; i < files.length; i++) {
      await uploadFile(files[i], i + 1, files.length, xhrRequests, token, user);
    }
  });
}

function uploadFile(file, fileIndex, totalFiles, xhrRequests, token, user) {
  if (!file && !fileIndex && !totalFiles && !xhrRequests) {
    console.log("no required paramters found to upload file");
    return;
  }

  return new Promise((resolve, reject) => {
    if (fileIndex > totalFiles) {
      resolve();
      return;
    }
    const xhr = new XMLHttpRequest();
    let progressPercent;
    const formData = new FormData();
    const headers = new Headers();

    formData.append("file", file);

    xhrRequests[fileIndex] = xhr;

    // Create HTML for progress bar and cancel button
    addProgressBarHtmlForEveryFile(fileIndex, file, xhrRequests);

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        progressPercent = (event.loaded / event.total) * 100;

        addProgressToProgressBarDiv(Math.round(progressPercent), fileIndex);
      }
    });

    xhr.open("POST", "/uploadFile", true);
    headers.append("acces_token", `${token}`);

    headers.forEach((value, key) => {
      xhr.setRequestHeader(key, value);
    });

    xhr.onload = () => {
      if (xhr.status === 200) {
        console.log(`File ${fileIndex} of ${totalFiles} uploaded successfully`);
        if (fileIndex === totalFiles && progressPercent === 100) {
          alert(`${fileIndex} of ${totalFiles} uploaded successfully`);
          hideUploadDrawer();
          recentFilesInitiailizer();
          myDriveInitializer();
          resolve();
        }

        resolve();
      } else {
        console.error(`Upload failed with status: ${xhr.statusText}`);
        document.getElementById(
          `uploading-file-name-${fileIndex}`
        ).textContent = `${file.name} upload failed`;
        reject(new Error(`Upload failed with status: ${xhr.statusText}`));
      }
    };

    xhr.onerror = () => {
      console.log("Failed to upload: network error");
      document.getElementById(
        `uploading-file-name-${fileIndex}`
      ).textContent = `${file.name} network error`;
      reject(new Error("Network error"));
    };
    xhr.onabort = () => {
      if (fileIndex === totalFiles) {
        hideUploadDrawer();
        resolve();
      }
      resolve();
    };

    xhr.send(formData);
  });
}

function toggleDrawer(drawer) {
  drawer.classList.toggle("open");
}
function hideUploadDrawer() {
  const progressBarBtn = document.getElementById("upload-progress-btn");
  const drawer = document.getElementById("file-uploadProgress-drawer");
  drawer.classList.remove("open");
  progressBarBtn.classList.remove("show");
}
function closedrawer(progressBarBtn, drawer) {
  drawer.classList.toggle("open");
  progressBarBtn.classList.toggle("show");
}

function addProgressBarHtmlForEveryFile(fileIndex, file, xhrRequests) {
  const uploadingFileLists = document.getElementById(
    "list-groupFor-fileUpload"
  );
  if (!uploadingFileLists) {
    console.log("Upload file list group not found");
    return;
  }
  uploadingFileLists.innerHTML += `
    <div class="list-group-item">
      <div class="d-flex justify-content-between">
        <span id="uploading-file-name-${fileIndex}"> ${file.name}</span>
       <div id="cancel-upload-container-${fileIndex}" class="cancelUploadContainer">
        <button class="btn btn-sm btn-primary cancelUploadBtn" id="cancel-upload-${fileIndex}">cancel</button>
       </div>
    
      </div>
      <div class="progress mt-2">
        <div
          class="progress-bar"
          id="progress-bar-percentage-viewer-${fileIndex}"
          role="progressbar"
          style="width: 0%"
          aria-valuenow="0"
          aria-valuemin="0"
          aria-valuemax="100"
        >0%</div>
      </div>
    </div>
  `;

  const cancelUploadBtn = document.getElementById(`cancel-upload-${fileIndex}`);
  cancelUploadBtn.addEventListener("click", () => {
    xhrRequests[fileIndex].abort();
    document.getElementById(
      `cancel-upload-container-${fileIndex}`
    ).innerHTML = `<span class="text-danger" style="font-size:14px;">Canceled</span>`;
  });
}

function addProgressToProgressBarDiv(progressPercent, fileIndex) {
  const progressBar = document.getElementById(
    `progress-bar-percentage-viewer-${fileIndex}`
  );
  if (!progressBar) {
    console.log("No progress bar found");
    return;
  }
  progressBar.style.width = `${progressPercent}%`;
  progressBar.setAttribute("aria-valuenow", progressPercent);
  progressBar.textContent = `${progressPercent}%`;
}
