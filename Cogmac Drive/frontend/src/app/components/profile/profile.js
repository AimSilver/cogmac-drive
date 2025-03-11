import {
  getTokenUserFromLocalStorage,
  logOut,
  sanitizeInput,
  saveTokenUserToLocalStorage,
} from "../../Utils/functions.js";
export function openProfileModal() {
  $("#profile-modal").modal("show");
  const { user, token } = getTokenUserFromLocalStorage();

  console.log("current user: ", user);
  // pushing user details in profile dynamically
  const profileEmail = document.getElementById("profile-email");
  const profileName = document.getElementById("profile-name");
  const profielPicture = document.getElementById("modal-profile-picture");
  profileEmail.innerText = user.email;
  profileName.innerText = user.username;
  profielPicture.innerHTML = `
<img class="modal-profile" src="${user.picture}" alt="profile-picture">
  `;

  renameUser(user, token);
  // logout when click signout
  const signoutBtn = document.getElementById("profile-signout-btn");
  signoutBtn.addEventListener("click", () => {
    logOut();
  });

  const manageProfileBtn = document.getElementById("manage-profile-acc");
  if (!manageProfileBtn) {
    console.log("manage-profile-btn not found");
  } else {
    manageProfileBtn.addEventListener("click", async () => {
      $("#profile-modal").modal("hide");
      $("#manage-profile-acc-modal").modal("show");
      const managaAccEmail = document.getElementById("manage-acc-email");
      const manageaccProfilePicture = document.getElementById(
        "manageacc-profile-picture"
      );
      manageaccProfilePicture.innerHTML = `
      <img class="modal-profile" src="${user.picture}" alt="profile-picture">`;
      managaAccEmail.innerText = user.email;
      await updateUserAcc();
    });
  }
}
// fucntion for updaying user details

async function updateUserAcc() {
  const ManageAccountForm = document.getElementById("manage-account-form");
  if (!ManageAccountForm) {
    console.log("No manage account form found");
  } else {
    ManageAccountForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      const formData = new FormData(ManageAccountForm);
      const formEnteries = Object.fromEntries(formData.entries());
      console.log("manage acc form enteries:", formEnteries);
      const sanitizedFormEnteries = {
        name: sanitizeInput(formEnteries.name),
        email: sanitizeInput(formEnteries.email),
        password: sanitizeInput(formEnteries.password),
        confirmpassword: sanitizeInput(formEnteries.confirmpassword),
      };
      if (!sanitizedFormEnteries) {
        console.log("form enteries not found");
      } else {
        try {
          const { token } = getTokenUserFromLocalStorage();
          const response = await fetch("/updateUserDetails", {
            method: "PUT",
            headers: {
              acces_token: `${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(sanitizedFormEnteries),
          });
          if (!response.ok) {
            const errorData = await response.json();
            alert(`!Failed :
                   "${errorData.message}"`);
            throw new Error(
              errorData.message || "Updating user account failed"
            );
          }
          const updatedUser = await response.json();
          console.log(updatedUser);
          alert(`!Success:
                 "${updatedUser.message}"}`);
          saveTokenUserToLocalStorage(updatedUser.key, updatedUser.user);
          $("#manage-profile-acc-modal").modal("show");
        } catch (error) {
          console.error(error.message);
        }
      }
    });
  }
}
// for renaming user
function renameUser(user, token) {
  const renameBtn = document.getElementById("edit-profile-name");
  if (!renameBtn) {
    console.log("no remame modal btn found");
  }
  renameBtn.addEventListener("click", () => {
    $("#profilerenameModal").modal("show");
    $("#profile-modal").modal("hide");
    const renameInput = document.getElementById("rename-input");
    if (!renameInput) {
      console.log("rename input element not found");
    } else {
      const submitRenameFormBtn = document.getElementById("rename-submit-btn");
      if (!submitRenameFormBtn) {
        console.log("no rename submit btn found");
      }
      submitRenameFormBtn.addEventListener("click", async () => {
        console.log("btn submit rename is clicked");
        console.log("renameinput", renameInput.value);
        const formData = {
          name: renameInput.value,
        };
        try {
          const response = await fetch("/renameUser", {
            method: "PUT",
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
            throw new Error(` failed to rename : ${errorData.message}`);
          }
          const updatedUser = await response.json();

          alert(`Success:
                  ${updatedUser.message}""`);
          user.username = updatedUser.updatedName;
          saveTokenUserToLocalStorage("User", user);
        } catch (error) {
          console.error("Error:", error.message);
        }
      });
    }
  });
}
