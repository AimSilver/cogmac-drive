import { adminGuard } from "./Guards/adminGuard.js";
import { authguard } from "./Guards/authGuard.js";

// method to include html dynamically
export async function includeHTML(url, callbackFn = async () => {}) {
  const element = document.querySelector(`[data-include='${url}']`);

  if (element) {
    try {
      const response = await fetch(url);
      console.log(`Fetching content from: ${url}`);
      if (response.ok) {
        element.innerHTML = await response.text();
        await callbackFn();
        console.log(`Content loaded and callback executed for: ${url}`);
      } else {
        element.innerHTML = "Content not found";
        console.error(`Failed to fetch content: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error loading content:", error);
      element.innerHTML = "Error loading content";
    }
  } else {
    console.error(`No element found with data-include='${url}'`);
  }
}
// method to sanitize input data
export function sanitizeInput(input) {
  return input.trim().replace(/[<>"'/]/g, "");
}
// method to validate email

export function validateEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}
// method to validate password
export function validatePassword(password) {
  return password.length >= 8;
}
// method to match password
export function matchPassword(password, confirmpassword) {
  return password === confirmpassword;
}
// method to get user and token from local storage
export function getTokenUserFromLocalStorage() {
  const user = JSON.parse(localStorage.getItem("User"));
  return { user, token: user.token };
}
// method to save token and user to local storage
export function saveTokenUserToLocalStorage(User_key, value) {
  localStorage.setItem(User_key, JSON.stringify(value));
}
// method to logout
export function logOut() {
  localStorage.removeItem("User");

  window.location.href = "http://localhost:3000";
}

//function to get all roles
export async function getAllRolesAvailable(user, token) {
  if (!authguard(token) && !adminGuard(user)) {
    console.log("User and req unauthorized");
  }
  try {
    const response = await fetch("/getAllRoles", {
      method: "GET",
      headers: {
        acces_token: `${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error("Error:" || errorData.message);
    } else {
      const roles = await response.json();
      console.log("fetched all roles succesfully", roles);
      return roles;
    }
  } catch (error) {
    console.log(error.message);
  }
}

// function to get all departments
export async function getAllDeptAvailable(user, token) {
  if (!authguard(token) && !adminGuard(user)) {
    console.log("User and req unauthorized");
  }
  try {
    const response = await fetch("/getdept", {
      method: "GET",
      headers: {
        acces_token: `${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error("Error:" || errorData.message);
    } else {
      const Departments = await response.json();
      return Departments;
    }
  } catch (error) {
    console.log(error.message);
  }
}

export function isoToDateAndTime(isoString) {
  const dateObject = new Date(isoString);
  const year = dateObject.getFullYear();
  const month = (dateObject.getMonth() + 1).toString().padStart(2, "0");
  const day = dateObject.getDate().toString().padStart(2, "0");
  const hours = dateObject.getHours().toString().padStart(2, "0");
  const minutes = dateObject.getMinutes().toString().padStart(2, "0");
  const formattedDate = `${day}-${month}-${year}`;
  const formattedTime = `${hours}:${minutes}`;
  return { formattedDate, formattedTime };
}

// toggle nav links
export function navLinksToggle(navLinks, navContains) {
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const target = this.getAttribute("data-target");
      navContains.forEach((contain) => {
        contain.classList.remove("show");
      });
      document.getElementById(target).classList.add("show");
    });
  });
}
