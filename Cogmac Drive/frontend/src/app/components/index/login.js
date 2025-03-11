import { loginForm, Email, Password } from "./constants.js";
import {
  sanitizeInput,
  saveTokenUserToLocalStorage,
  validateEmail,
  validatePassword,
} from "../../Utils/functions.js";
import { authguard } from "../../Utils/Guards/authGuard.js";
import { adminGuard } from "../../Utils/Guards/adminGuard.js";
import { managerGuard } from "../../Utils/services/managerGuard.js";
document.addEventListener("DOMContentLoaded", () => {
  if (!loginForm) {
    console.error("Login form not found");
    return;
  }
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = sanitizeInput(Email.value);
    const password = sanitizeInput(Password.value);
    if (!validateEmail(email) || !validatePassword(password)) {
      alert("Invalid email or password format");
      return;
    }
    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login Failed");
      }
      const user = await response.json();
      console.log(user, "login user", user.token);
      const user_key = "User";
      saveTokenUserToLocalStorage(user_key, user);

      if (authguard(user.token) && adminGuard(user)) {
        window.location.href = "src/app/components/admin/admin.html";
      } else if (authguard(user.token) && managerGuard(user)) {
        window.location.href = "src/app/components/manager/manager.html";
      } else if (authguard(user.token)) {
        window.location.href = "src/app/components/viewer/viewer.html";
      } else {
        console.log("user not authorized");
        console.log("user not authorized");
        console.log("authguard(user.token):", authguard(user.token));
        console.log("adminGuard(user):", adminGuard(user));
        console.log("managerGuard(user):", managerGuard(user));
        return;
      }
    } catch (error) {
      console.error("Error", error);
      alert("Invalid email or password. Please try again.");
    }
  });
});
