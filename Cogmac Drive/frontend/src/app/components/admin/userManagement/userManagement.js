import { adminGuard } from "../../../Utils/Guards/adminGuard.js";
import { authguard } from "../../../Utils/Guards/authGuard.js";
import {
  getTokenUserFromLocalStorage,
  getAllDeptAvailable,
  getAllRolesAvailable,
} from "../../../Utils/functions.js";
import { usermanagementFilesContainer } from "../constants.js";

//1.getallusers function

export async function getAllUsers() {
  const { token } = getTokenUserFromLocalStorage();
  const response = await fetch("/getUsers", {
    method: "GET",
    headers: { acces_token: `${token}` },
  });
  if (!response.ok) {
    throw new Error("Failed to Fetch Users");
  }
  const users = await response.json();
  console.log(users, "all users");
  if (!usermanagementFilesContainer) {
    console.log("usermanagement files container not found");
    return;
  }
  usermanagementFilesContainer.innerHTML = "";

  users.forEach(async (user, index) => {
    // if (user.isAdmin) {
    //   return;
    // }

    console.log(user, index);
    const numberOfDeptRoles = user.roles.length;
    const modalId = `editUsermgmtModal-${index}`;
    console.log(modalId);
    usermanagementFilesContainer.innerHTML += `
               <div class="row file-usermgmnt " id="row-file-${index}" >
                  <div class="col-sm-2 btn btn-sm btn-success" id="col-name-${index}" style=" border: solid 1px #ccc;">
                   ${user.userId.name}
                  </div>
        
    
                  <div class="col-sm-3 btn btn-sm btn-info file-data"  id="col-email-${index}">
                   ${user.userId.email}
                  </div>
     
                  <div class="col-sm-5 pl-5 btn btn-primary btn-sm dropdown-toggle dropright file-data" type="button" id="col-dept-${index}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                   Department/Roles<span class="badge badge-light ml-5" data-toggle="dropdown">${numberOfDeptRoles}</span>
                  </div>
                  <div class="dropdown-menu dropdown-menu-right pr-2 py-1" id="dropdown-menu-deptroles-${index}" aria-labelledby="col-dept-${index}" aria-haspopup="true" aria-expanded="false" style="width:410px">
                 
                
                
   

                  </div>
                  <div id="confirm-user-role-deletion-container-${index}"></div>
                  
                  <div class="col-sm-1 btn btn-sm btn-light file-data" id="col-status-${index}" style="color: ${
      user.isActive ? "darkblue" : "darkred"
    } ;">
                   ${user.isActive ? "Active" : "Blocked"}
                   
                  </div>
                          
                  <div class="col-sm-1 btn btn-sm btn-light ">
                  <i
                     class="fa fa-ellipsis-v ellipsis-btn " type="button" id="dropdownMenu${index}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                     
                     id="ellipsis-btn-usermgmt-${index}"
                     aria-hidden="true"
                   >
                   </i>
                   <div class="dropdown-menu" aria-labelledby="dropdownMenu${index}">
                      <button class="dropdown-item" type="button" data-toggle="modal"data-target="#${modalId}">
                       <i class="fas fa-edit"></i> Edit
                      </button>
                      <div class="hr" /></div>
                      <button class="dropdown-item" id="delete-user-btn-${index}" data-toggle="modal" data-target="#deleteConfirmationModal-${index}" type="button">
                      <i class="fas fa-trash"></i> Delete
                      </button>
                      <div class="hr" /></div>
                      <button class="btn dropdown-item" id="block-user-btn-${index}">
                      ${
                        user.isActive
                          ? `<i class="fas fa-ban"></i>`
                          : `<i class="fa fa-unlock" aria-hidden="true"></i>`
                      }
                       ${user.isActive ? `Block` : "Unblock"}
                      </button>
                    </div>
                    
      
   
                           
  
  
  
                  
                </div>
  
                 <div class="modal fade" id="deleteConfirmationModal-${index}" tabindex="-1" role="dialog" aria-labelledby="deleteConfirmationModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="deleteConfirmationModalLabel">Confirm Deletion</h5>
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div class="modal-body">
                      <p class="lead">Are you sure you want to delete this User?</p>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-dismiss="modal">No</button>
                      <button type="submit" class="btn btn-danger" id="confirmDeleteButton-${index}" delete-id="${
      user.id
    }">Yes</button>
                    </div>
                  </div>
                </div>
              </div>
                <!--  -->
                <!--  -->
                <!-- Edit User role and department modal -->
                <!--  -->
                <!--  -->
                <div class="edit-userDetails-modal">
                  <div
                    class="modal fade"
                    id="${modalId}"
                    tabindex="-1"
                    role="dialog"
  
                    aria-hidden="true"
                  >
                    <div class="modal-dialog">
                      <div class="modal-content" style="top: 200px">
                        <div class="modal-header">
                          <h5 class="modal-title">Edit - <small class="text-muted">${
                            user.userId.name
                          }</small> </h5>
                          <button
                            type="button"
                            class="close"
  
                            data-dismiss="modal"
                            aria-label="Close"
                          >
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div class="modal-body">
  
                          <form class="editUsermgmt-form" id="editUsermgmt-form-${index}" data-user-id="${
      user.id
    }" data-id="${index}">
                            <div class="form-group">
                             <label for="role">Role</label>
                              <select name="role" class="form-control form-control-sm" id="select-role-${index}">
                               <option disabled selected >${user.role}</option>
                               <option value="Admin">Admin</option>
                               <option value="User">User</option>
                               <option value="Manager">Manager</option>
                               <option value="Viewer">Viewer</option>
                              </select>
                           </div>
                           
                           <div class="form-group">
                             <label for="department">Department</label>
                              <select name="department" class="form-control form-control-sm" id="select-dept-${index}">
                               <option disabled selected >${user.dept}</option>
                               <option value="IT">IT</option>
                               <option value="Software development">
                                Software Development
                               </option>
                              </select>
                            </div>
  
                          </form>
                        </div>
                        <div class="modal-footer">
                          <button
                            type="button"
                            class="btn btn-secondary"
                            data-dismiss="modal"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            class="btn btn-primary"
                            data-user="${user.id}"
                            data-index="${index}"
                            id="editUsermgmt-form-btn-submit-${index}"
                          >
                            Ok
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
  
             `;
  });
  await setSelectRolesDept(users);
  await userDepartmentRoles(users, token);
  await changeRoleDepartment(users, token);
  await toggleBlockUser(users, token);
  await deleteUser(users, token);
}

// fucntion to changeroleand department of the selected user

async function changeRoleDepartment(users, token) {
  if (!users && !token) {
    console.log("no user and token found for changing role and dept");
    return;
  }
  users.forEach((user, index) => {
    const submitBtn = document.getElementById(
      `editUsermgmt-form-btn-submit-${index}`
    );
    if (!submitBtn) {
      console.log("no submit btn forund for user");
    }

    submitBtn.addEventListener("click", async (e) => {
      const userId = submitBtn.getAttribute("data-user");
      const indexId = submitBtn.getAttribute("data-index");
      console.log("Userid,indexid:", userId, indexId);

      const role = document.getElementById(`select-role-${indexId}`);
      const dept = document.getElementById(`select-dept-${indexId}`);
      console.log("role/dept", role, dept);
      const formData = {
        role: role.value,
        department: dept.value,
        Id: userId,
      };
      console.log("formdata:", formData);
      try {
        const response = await fetch("/userRoleManagement", {
          method: "POST",
          headers: {
            acces_token: `${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        if (!response.ok) {
          const errorData = await response.json();
          alert(`!Failed :
                 "${errorData.message}"`);
          $(`#editUsermgmtModal-${indexId}`).modal("hide");
          throw new Error(errorData.message || "!Failed");
        }
        const ServerResult = await response.json();
        // updated role and departments inside editeduser fetched from server
        const updateDetails = ServerResult.editedUser;
        console.log(updateDetails);

        alert("New role and department Assigned", ServerResult.message);

        // close bootstrap modal after finsihing update
        $(`#editUsermgmtModal-${indexId}`).modal("hide");
        await getAllUsers();
      } catch (error) {
        console.error("Error", error);
      }
    });
  });
}

// functionn to delete selected user

async function deleteUser(users, token) {
  if ((!users, !token)) {
    console.log("no users or token found for deleting department");
    return;
  }
  users.forEach((user, index) => {
    const confirmDeletebtn = document.getElementById(
      `confirmDeleteButton-${index}`
    );
    if (confirmDeletebtn) {
      confirmDeletebtn.addEventListener("click", async (e) => {
        console.log("delete clicked");
        const deleteId = e.target.getAttribute("delete-id");
        console.log("deleteid:", deleteId);
        console.log("userid", user.userId.id);
        console.log("email:", user.userId.email);

        const email = user.userId.email;
        const userId = user.userId.id;

        try {
          const response = await fetch(
            `/deleteUser?userId=${userId}&email=${email}&deleteRoleId=${deleteId}`,
            {
              method: "DELETE",
              headers: {
                acces_token: `${token}`,
              },
            }
          );
          if (!response.ok) {
            const errorData = await response.json();
            alert(`! Failed to delete user: "${errorData.message}"`);
            $(`#deleteConfirmationModal-${index}`).modal("hide");
            throw new Error(errorData.message || "!Failed ");
          } else {
            const serverResult = await response.json();
            alert("!Successfull:", serverResult.message);
            // const parentElement = document.getElementById(`row-file-${index}`);
            // parentElement.remove();
            $(`#deleteConfirmationModal-${index}`).modal("hide");
            await getAllUsers();
          }
        } catch (error) {
          console.error("Error:", error.message);
        }
      });
    }
  });
}

// method for toggling user block/unblock

async function toggleBlockUser(users, token) {
  if (!users && !token) {
    return;
  }
  users.forEach((user, index) => {
    const toggleBlockBtn = document.getElementById(`block-user-btn-${index}`);
    if (!toggleBlockBtn) {
      console.log("toglle button nnot found");
    } else {
      toggleBlockBtn.addEventListener("click", async () => {
        console.log("toglle btn clicked");
        console.log("1", toggleBlockBtn.textContent);

        console.log("2", toggleBlockBtn.textContent);
        const Id = user.id;
        if (!Id) {
          console.log("usermanagement id not found");
        } else {
          try {
            const response = await fetch("/toggleBlock", {
              method: "PATCH",
              headers: {
                acces_token: `${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ Id }),
            });
            if (!response.ok) {
              const errorData = await response.json();
              alert(`!Failed:
                      "${errorData.message}"`);
              throw new Error(
                errorData.message || "failed to block/unblock user"
              );
            }
            const serverResult = await response.json();
            alert(`Success:
                    "${serverResult.message}"`);
            await getAllUsers();
          } catch (error) {
            console.error("Error:", error.message);
          }
        }
      });
    }
  });
}

// method for adding roles and departments to select menu
async function setSelectRolesDept(users) {
  if (!users) {
    return;
  }
  const { user, token } = getTokenUserFromLocalStorage();
  if ((!authguard(token), !adminGuard(user))) {
    console.log("unauthorized access");
    return;
  }
  try {
    const roles = await getAllRolesAvailable(user, token);
    console.log("available roles", roles);
    const Departments = await getAllDeptAvailable(user, token);
    console.log("available dept", Departments);

    if (!roles || !Departments) {
      console.log("no roles or departments found");
      return;
    } else {
      users.forEach((u, index) => {
        const selectRoleBtn = document.getElementById(`select-role-${index}`);
        const selectDeptBtn = document.getElementById(`select-dept-${index}`);
        selectRoleBtn.innerHTML = "";
        selectDeptBtn.innerHTML = "";
        roles.forEach((role) => {
          selectRoleBtn.innerHTML += `
        <option value="${role.name}">${role.name}</option>
        `;
        });
        Departments.forEach((dept) => {
          selectDeptBtn.innerHTML += `
        <option value="${dept.name}">${dept.name}</option>
        `;
        });
      });
    }
  } catch (error) {
    console.error("Error fetching users:", error.message);
  }
}

//method for showing users current roles and departments

async function userDepartmentRoles(users, token) {
  if (!users) {
    return;
  }
  console.log("req recieved for  user dept for deptroles");
  users.forEach((user, index) => {
    console.log("req recieved for  user dept for each");
    const dropdownMenuId = `dropdown-menu-deptroles-${index}`;
    const dropdownMenuForRoleManagement =
      document.getElementById(dropdownMenuId);
    const confirmRoleDeletionConainer = document.getElementById(
      `confirm-user-role-deletion-container-${index}`
    );

    if (dropdownMenuForRoleManagement && confirmRoleDeletionConainer) {
      console.log(
        `Populating dropdown for user ${index} with ID: ${dropdownMenuId}`
      );
      dropdownMenuForRoleManagement.innerHTML = ""; // Clear previous content

      user.roles.forEach((role, roleIndex) => {
        console.log("role id for role index ", roleIndex, role._id, user.id);
        const roleButtonId = `delete-user-role-btn-${index}-${roleIndex}`;
        const modalId = `confirm-userRole-delete-modal-${index}-${roleIndex}`;
        const confirmBtnId = `confirm-userRole-delete-modal-btn-${index}-${roleIndex}`;

        const roleButtonHTML = `
        
        <button class="btn btn-sm   btn-primary btn-block m-1" type="button">
            ${role.dept}/${role.role}
              <i class="fa fa-trash" data-id="${role._id}" id="${roleButtonId}"></i>
         </button>
         `;

        dropdownMenuForRoleManagement.innerHTML += roleButtonHTML;
        confirmRoleDeletionConainer.innerHTML += `
        <div class="modal fade" id="${modalId}" tabindex="-1" role="dialog" aria-labelledby="deleteConfirmationModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="deleteConfirmationModalLabel">Confirm Deletion</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <p class="lead">Are you sure you want to delete this Role?</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">No</button>
        <button type="submit" class="btn btn-danger" id="${confirmBtnId}"">Yes</button>
      </div>
    </div>
  </div>
</div>
        
        `;
        setTimeout(() => {
          const deleteRoleBtn = document.getElementById(roleButtonId);

          if (deleteRoleBtn) {
            deleteRoleBtn.addEventListener("click", () => {
              console.log(
                "delete role btn clicked for",
                roleIndex,
                index,
                role._id,
                "userid",
                user.id
              );

              $(`#${modalId}`).modal("show");
            });
          } else {
            console.log("delete role dept button  not found ");
          }
          const confirmRoleDeletionBtn = document.getElementById(confirmBtnId);
          if (confirmRoleDeletionBtn) {
            confirmRoleDeletionBtn.addEventListener("click", async () => {
              console.log(
                "confirm  role deletion btn clicked for",
                roleIndex,
                index,
                role._id,
                "userid",
                user.id
              );
              await removeUsersRoleDept(user.id, role._id, token, modalId);
            });
          }
        }, 0);
      });
    } else {
      console.error(
        `Dropdown menu not found for user ${index} with ID: ${dropdownMenuId}`
      );
    }
  });
}

async function removeUsersRoleDept(userId, roleId, token, modalId) {
  console.log("req receieved for deleting user role dept", userId, roleId);
  if (!userId && !roleId && !token) {
    console.log("sufficient parameters not found for removing role of user");
    return;
  }

  try {
    const response = await fetch(
      `/deleteUserRole?userId=${userId}&roleId=${roleId}`,
      {
        method: "DELETE",
        headers: {
          acces_token: `${token}`,
        },
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      alert(`!Failed: 
             "${errorData.message}"`);
      throw new Error(
        errorData.message || "failed to delete selected role of a user"
      );
    } else {
      const ServerResult = await response.json();
      alert(`success: 
             "${ServerResult.message}"`);
      $(`#${modalId}`).modal("hide");
      await getAllUsers();
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}
