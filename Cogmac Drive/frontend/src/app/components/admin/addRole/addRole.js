import { getTokenUserFromLocalStorage } from "../../../Utils/functions.js";

//adding new role
export function addNewRole() {
  const { token } = getTokenUserFromLocalStorage();
  $("#addNewRoleModal").modal("show");
  getAllRoles(token);
  const newRoleForm = document.getElementById("new-role-form");
  if (newRoleForm) {
    newRoleForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const newRoleValue = document.getElementById("new-role-input").value;
      try {
        const response = await fetch("/addNewRole", {
          method: "POST",
          headers: {
            acces_token: `${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newRole: newRoleValue }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          alert(`!Failed : 
                 "${errorData.message}"`);

          throw new Error(errorData.message || "!Failed to add New role");
        } else {
          const severResult = await response.json();
          console.log(severResult.message);
          alert(`"!Success" : 
                  "${severResult.message}"`);
          getAllRoles(token);
        }
      } catch (error) {
        console.error("Error", error.message);
      }
    });
  }
}

async function getAllRoles(token) {
  try {
    const response = await fetch("/getAllRoles", {
      method: "GET",
      headers: {
        acces_token: `${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Operation Failed to get all roles:${errorData.message}`);
    } else {
      const roles = await response.json();
      console.log("fetched all roles succesfully", roles);
      const roleContainer = document.getElementById("roles-conatiner");
      roleContainer.innerHTML = "";
      roles.forEach((role, index) => {
        roleContainer.innerHTML += `
              <div class="row">
                <div class="col-sm d-flex justify-content-start ml-3" style="color: darkred;">${role.name}</div>
                <div class="col-sm d-flex justify-content-center" >
                 <span class="delete-role" data-toggle="modal" style="color: darkblue;cursor:pointer;" data-target="#deleteConfirmationModal" data-id="${role.id}">
                 <i class="fa fa-trash" aria-hidden="true"></i>
                 </span>
                </div>
                
              </div>
               <hr class="hr" id="hr-${index}" />
               
              
        `;
      });
      deleteRole(token);
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}
// method to show confirm deleteion modal and for deleting a role
function deleteRole(token) {
  const deleteRoleBtn = document.querySelectorAll(".delete-role");
  deleteRoleBtn.forEach((role, index) => {
    role.addEventListener("click", () => {
      $("#deleteConfirmationModal").modal("show");
      const deleteId = role.getAttribute("data-id");
      console.log(deleteId, index);
      const confirmDeleteBtn = document.getElementById("confirmDeleteButton");
      if (confirmDeleteBtn) {
        console.log("confirm deletion id:", deleteId);
        confirmDeleteBtn.onclick = async () => {
          try {
            const response = await fetch(`/deleteRole/${deleteId}`, {
              method: "DELETE",
              headers: {
                acces_token: `${token}`,
              },
            });
            if (!response.ok) {
              const errorData = await response.json();
              alert(`!Error Deleting Role :
                   "${errorData.message}"`);
            } else {
              const ServerResult = await response.json();
              alert(`!Success :
                   "${ServerResult.message}"`);

              $("#deleteConfirmationModal").modal("hide");
              // removedeleted role row and its horizontal line
              role.parentElement.parentElement.remove();
              const hrTag = document.getElementById(`hr-${index}`);
              hrTag.remove();
            }
          } catch (error) {
            console.error("Error:", error.message);
          }
        };
      } else {
        console.log("Confirm deletion button not found");
      }
    });
  });
}
