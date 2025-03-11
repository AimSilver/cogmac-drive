import { navLinksToggle } from "../../Utils/functions.js";
import { includeHTML } from "../../Utils/functions.js";
import { initializeDeptContainer } from "./department/dept.js";
import { initializeAddUserContainer } from "./addUser/addUser.js";
import { addNewRole } from "./addRole/addRole.js";
import { openProfileModal } from "../profile/profile.js";
import { getTokenUserFromLocalStorage } from "../../Utils/functions.js";
import { authguard } from "../../Utils/Guards/authGuard.js";

import { getAllUsers } from "./userManagement/userManagement.js";
import {
  navLinks,
  navContains,
  deptBtn,
  addUserBtn,
  usermanagementBtn,
  addNewRoleBtn,
  profileModalBtn,
  adminhomeBtn,
  headerTitle,
  manageUsersCardDiv,
} from "./constants.js";

navLinksToggle(navLinks, navContains);

document.addEventListener("DOMContentLoaded", async () => {
  const { user, token } = getTokenUserFromLocalStorage();
  if (!authguard(token) && !adminGuard(user)) {
    console.log("unauthorized acess");
    return;
  }

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
    headerTitle.innerText = "Manage Users";
    await getAllUsers();
  });
  addNewRoleBtn.addEventListener("click", () => {
    const newRoleUrl = "/src/app/components/admin/addRole/addRole.html";
    includeHTML(newRoleUrl, addNewRole);
  });
  profileModalBtn.addEventListener("click", () => {
    const profileUrl = "/src/app/components/profile/profile.html";
    includeHTML(profileUrl, openProfileModal);
  });
  adminhomeBtn.addEventListener("click", () => {
    headerTitle.innerText = "Home";
  });
  manageUsersCardDiv.addEventListener("click", () => {
    usermanagementBtn.click();
  });
});
