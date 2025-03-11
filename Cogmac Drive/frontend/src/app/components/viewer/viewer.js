import {
  navLinks,
  navContains,
  offcanvasBtn,
  profileModalBtn,
  pageTitle,
  departmentfilesNavLink,
} from "./constants.js";

import {
  getTokenUserFromLocalStorage,
  includeHTML,
  navLinksToggle,
} from "../../Utils/functions.js";
import { activeUsersInitializer } from "./activeUsers/activeUsers.js";
import { authguard } from "../../Utils/Guards/authGuard.js";
import { userHomeInitializer } from "./home/home.js";
import { openProfileModal } from "../profile/profile.js";
import { departmentFilesContainerIntializer } from "./departmentDrive/departmetnFiles.js";

// toggle between different sidebar navs
navLinksToggle(navLinks, navContains);

document.addEventListener("DOMContentLoaded", async () => {
  const { user, token } = getTokenUserFromLocalStorage();
  console.log(user, user.picture);
  if (!authguard(token)) {
    console.log("unauthorized acess");
    return;
  }
  profileModalBtn.innerHTML = `<img class="profile-picture-img" src="${user.picture}" alt="">`;
  pageTitle.innerText = `Welcome ${user.username.split(" ")[0]}!`;
  await userHomeInitializer();
  offcanvasBtn.addEventListener("click", async () => {
    console.log("offcanvas clicked");
    await activeUsersInitializer();
  });

  profileModalBtn.addEventListener("click", () => {
    const profileUrl = "/src/app/components/profile/profile.html";
    includeHTML(profileUrl, openProfileModal);
  });
  departmentfilesNavLink.addEventListener("click", async () => {
    await departmentFilesContainerIntializer();
  });
});
