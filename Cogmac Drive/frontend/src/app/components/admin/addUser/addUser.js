import { getAdduserElements } from "./constants.js";
import {
  sanitizeInput,
  validateEmail,
  validatePassword,
  matchPassword,
  getTokenUserFromLocalStorage,
  getAllRolesAvailable,
  getAllDeptAvailable,
} from "../../../Utils/functions.js";
import { getAllUsers } from "../userManagement/userManagement.js";

export function initializeAddUserContainer() {
  const { closeAdduserBtn, adduserContainer } = getAdduserElements();
  if (closeAdduserBtn && adduserContainer) {
    closeAdduserBtn.addEventListener("click", () => {
      console.log("closing add user container");
      adduserContainer.style.display = "none";
    });
    const { user, token } = getTokenUserFromLocalStorage();
    registerUser(token);
    setSelectRolesDept(user, token);
  } else {
    console.error("Elements not found:", { closeAdduserBtn, adduserContainer });
  }
}

// function to register users
async function registerUser(token) {
  const registrationForm = document.getElementById("registration-form");
  if (registrationForm) {
    registrationForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(registrationForm);
      const formEnteries = Object.fromEntries(formData.entries());
      console.log(formEnteries);
      const sanitizedFormEnteries = {
        firstname: sanitizeInput(formEnteries.firstname),
        lastname: sanitizeInput(formEnteries.lastname),
        email: sanitizeInput(formEnteries.email),
        password: sanitizeInput(formEnteries.password),
        confirmpassword: sanitizeInput(formEnteries.confirmpassword),
        role: sanitizeInput(formEnteries.role),
        department: sanitizeInput(formEnteries.department),
      };
      sanitizedFormEnteries.name = `${sanitizedFormEnteries.firstname} ${sanitizedFormEnteries.lastname}`;
      if (!validateEmail(sanitizedFormEnteries.email)) {
        alert("Invalid email address");
        return;
      }
      if (!validatePassword(sanitizedFormEnteries.password)) {
        alert("Invalid Password");
        return;
      }
      if (
        !matchPassword(
          sanitizedFormEnteries.password,
          sanitizedFormEnteries.confirmpassword
        )
      ) {
        alert("Password does not match");
        return;
      }
      console.log("sanitizedentry:", sanitizedFormEnteries);
      try {
        const registrationResponse = await fetch("/registration", {
          method: "POST",
          headers: {
            acces_token: `${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sanitizedFormEnteries),
        });
        const registrationResult = await registrationResponse.json();
        if (!registrationResponse.ok) {
          const errorData = await registrationResponse.json();
          throw new Error(errorData.message || "Registration Failed");
        } else {
          alert(`${registrationResult.message}`);
          registrationForm.reset();
          await getAllUsers();
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while submitting the form");
      }
    });
  }
}
// function to set select available  roles
async function setSelectRolesDept(user, token) {
  const roles = await getAllRolesAvailable(user, token);
  console.log("available roles", roles);
  const Departments = await getAllDeptAvailable(user, token);
  console.log("available dept", Departments);
  if (!roles || !Departments) {
    console.log("no roles or departments found");
    return;
  } else {
    const selectRoleBtn = document.getElementById("add-user-role");
    const selectDeptBtn = document.getElementById("add-user-dept");
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
  }
}
