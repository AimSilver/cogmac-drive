import {
  navLinks,
  navContains,
  profileModalBtn,
  fileUploadBtn,
  recentBtn,
  myDriveBtn,
  trashContainerBtn,
  starredNavBtn,
  pageTitle,
  homeNavBtn,
} from "./constants.js";

import {
  getTokenUserFromLocalStorage,
  includeHTML,
  navLinksToggle,
} from "../../Utils/functions.js";

import { openProfileModal } from "../profile/profile.js";
import { authguard } from "../../Utils/Guards/authGuard.js";

import { uploadFileInitializer } from "../fileUpload/fileUpload.js";
import { recentFilesInitiailizer } from "./recent/recent.js";
import { myDriveInitializer } from "./myDrive/myDrive.js";
import { starredContainerInitializer } from "./starred/starred.js";
import { trashContainerInitializer } from "./trash/trash.js";
import { managerGuard } from "../../Utils/services/managerGuard.js";
import { ManagerhomeIntializer } from "./home/home.js";

// toggle between different sidebar navs
navLinksToggle(navLinks, navContains);

document.addEventListener("DOMContentLoaded", async () => {
  const { user, token } = getTokenUserFromLocalStorage();
  if (!authguard(token) && !managerGuard(user)) {
    console.log("unauthorized acess");
    return;
  }
  if (!(user.picture === undefined)) {
    console.log(user.picture);
    profileModalBtn.innerHTML = `<img class="profile-picture-img" src="${user.picture}" alt="">`;
  } else {
    profileModalBtn.innerHTML = ``;
  }

  await ManagerhomeIntializer();
  pageTitle.innerText = `Welcome ${user.username.split(" ")[0]}!`;
  profileModalBtn.addEventListener("click", () => {
    const profileUrl = "/src/app/components/profile/profile.html";
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
  starredNavBtn.addEventListener("click", async () => {
    await starredContainerInitializer();
  });
  trashContainerBtn.addEventListener("click", async () => {
    await trashContainerInitializer();
  });
  homeNavBtn.addEventListener("click", async () => {
    await ManagerhomeIntializer();
  });
});
