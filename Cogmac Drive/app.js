import {
  navLinks,
  navContains,
  newButton,
  dropdownItem,
  deptBtn,
  addUserBtn,
  usermanagementBtn,
  addNewRoleBtn,
  profileModalBtn,
  fileUploadBtn,
  recentBtn,
  myDriveBtn,
  adminHomeBtn,
  trashContainerBtn,
} from "../components/constants.js";
import { initializeDeptContainer } from "./frontend/src/app/components/admin/department/dept.js";
import {
  getTokenUserFromLocalStorage,
  includeHTML,
} from "./frontend/src/app/Services/functions.js";
import { initializeAddUserContainer } from "./frontend/src/app/components/admin/addUser/addUser.js";
import { getAllUsers } from "./frontend/src/app/components/admin/userManagement/userManagement.js";
import { addNewRole } from "./frontend/src/app/components/admin/addRole/addRole.js";
import { openProfileModal } from "./frontend/src/app/components/profile/profile.js";
import { authguard } from "./frontend/src/app/Services/authGuard.js";
import { adminGuard } from "./frontend/src/app/Services/adminGuard.js";
import { uploadFileInitializer } from "./frontend/src/app/components/fileUpload/fileUpload.js";
import { recentFilesInitiailizer } from "./frontend/src/app/components/manager/recent/recent.js";
import { myDriveInitializer } from "./frontend/src/app/components/manager/myDrive/myDrive.js";
import { homeContainerInitializer } from "./frontend/src/app/components/manager/home/home.js";
import { trashContainerInitializer } from "./frontend/src/app/components/manager/trash/trash.js";

navLinks.forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const target = e.target.getAttribute("data-target");
    navContains.forEach((contain) => {
      contain.classList.remove("show");
    });
    document.getElementById(target).classList.add("show");
  });
});

newButton.addEventListener("click", (e) => {
  console.log("button is clicked");
  e.preventDefault();
  newButton.style.display = "none";
});

document.addEventListener("click", (event) => {
  if (
    dropdownItem.contains(event.target) ||
    !newButton.contains(event.target)
  ) {
    newButton.style.display = "flex";
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  const { user, token } = getTokenUserFromLocalStorage();
  if (!authguard(token) && !adminGuard(user)) {
    console.log("unauthorized acess");
    return;
  }
  await homeContainerInitializer();
  deptBtn.addEventListener("click", () => {
    console.log("deptbtn clicked");
    const deptUrl = "/src/app/components/admin/department/department.html";
    includeHTML(deptUrl, initializeDeptContainer);
  });
  addUserBtn.addEventListener("click", () => {
    console.log("adduser clicked");
    const adduserUrl = "/src/app/components/admin/addUser/addUser.html";
    includeHTML(adduserUrl, initializeAddUserContainer);
  });
  usermanagementBtn.addEventListener("click", async () => {
    await getAllUsers();
  });
  addNewRoleBtn.addEventListener("click", () => {
    const newRoleUrl = "/src/app/components/admin/addRole/addRole.html";
    includeHTML(newRoleUrl, addNewRole);
  });
  profileModalBtn.addEventListener("click", () => {
    const profileUrl = "/src/app/components/admin/profile/profile.html";
    includeHTML(profileUrl, openProfileModal);
  });
  fileUploadBtn.addEventListener("click", () => {
    const uploadFileUrl = "/src/app/components/fileUpload/uploadFiles.html";
    includeHTML(uploadFileUrl, uploadFileInitializer);
  });
  recentBtn.addEventListener("click", async () => {
    await recentFilesInitiailizer();
  });
  myDriveBtn.addEventListener("click", async () => {
    await myDriveInitializer();
  });
  adminHomeBtn.addEventListener("click", async () => {
    await homeContainerInitializer();
  });
  trashContainerBtn.addEventListener("click", async () => {
    await trashContainerInitializer();
  });
});
