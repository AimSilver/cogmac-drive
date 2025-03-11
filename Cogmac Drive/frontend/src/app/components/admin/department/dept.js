import { getTokenUserFromLocalStorage } from "../../../Utils/functions.js";
import { getDeptElements } from "./constants.js";

export function initializeDeptContainer() {
  const { closeButton, deptcontainer } = getDeptElements();

  if (closeButton && deptcontainer) {
    closeButton.addEventListener("click", () => {
      console.log("Closing dept container");
      deptcontainer.style.display = "none";
    });
    const { token } = getTokenUserFromLocalStorage();
    createNewDeptForm(token);
    getDepartments(token);
  } else {
    console.error("Elements not found:", { closeButton, deptcontainer });
  }
}
// function to create new department
function createNewDeptForm(token) {
  const form = document.getElementById("dept-form");
  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const formEnteries = Object.fromEntries(formData.entries());
      const url = "/newdept";
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            acces_token: ` ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formEnteries),
        });
        const result = await response.json();
        if (response.ok) {
          alert(`${result.message}`);
          form.reset();
          getDepartments(token);
        } else {
          alert("FormSubmission Failed");
        }
      } catch (error) {
        console.error("Error", error);
        alert("An error occurred while submitting the form");
      }
    });
  }
}

// function to get department list
async function getDepartments(token) {
  const deptList = document.getElementById("dept-list");
  const deptListContent = document.getElementById("dept-list-content");
  if (deptList) {
    const url = "/getdept";
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          acces_token: `${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const departments = await response.json();
      console.log("departments", departments);
      deptListContent.innerHTML = "";
      departments.forEach((dept) => {
        deptListContent.innerHTML += `  
        
                
                 <div class="row d-flex justify-content-between">
              <div class="col d-flex justify-content-start ml-2">
                <span>${dept.name}</span>
              </div>

              <div class="col d-flex justify-content-center">
                <span
                 class="delete-dept"
                  data-toggle="modal"
                  data-target="#deleteConfirmationModal"
                  data-id="${dept._id}"
                >
                  <i class="fa fa-trash" "></i>
                </span>
              </div>
              </div>
               
            `;
      });
      deleteDepartment(token);
    } catch (error) {
      console.error("Error", error);
    }
  }
}

//function to delete departments
async function deleteDepartment(token) {
  document.querySelectorAll(".delete-dept").forEach((item) => {
    item.addEventListener("click", async (event) => {
      const confirmDeleteDept = document.getElementById("confirmDeleteButton");
      confirmDeleteDept.addEventListener("click", async () => {
        const id = item.getAttribute("data-id");
        const deleteUrl = `/deletedept/${id}`;
        try {
          const deleteResponse = await fetch(deleteUrl, {
            method: "DELETE",
            headers: {
              acces_token: `${token}`,
              "Content-Type": "application/json",
            },
          });
          if (!deleteResponse) {
            throw new Error("Failed to delete Department");
          }
          const deleteResult = await deleteResponse.json();
          alert(deleteResult.message);
          item.parentElement.parentElement.remove();
          //its boostrap jquerry method to hide and show any modal
          $("#deleteConfirmationModal").modal("hide");
        } catch (error) {
          console.error("Error", error);
          alert("Failed to delete department");
        }
      });
    });
  });
}
