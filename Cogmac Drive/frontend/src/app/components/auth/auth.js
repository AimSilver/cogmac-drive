import { authguard } from "../../Utils/Guards/authGuard.js";
import { adminGuard } from "../../Utils/Guards/adminGuard.js";
import { managerGuard } from "../../Utils/services/managerGuard.js";
import { saveTokenUserToLocalStorage } from "../../Utils/functions.js";

const authLoginBtn = document.getElementById("auth-login-btn");
authLoginBtn.addEventListener("click", async () => {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  if (!code) {
    console.log("bad request ");
    return;
  }
  try {
    const response = await fetch("/googleSignin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });
    if (!response.ok) {
      throw new Error(await response.json().message);
    }
    const user = await response.json();

    const user_key = "User";
    saveTokenUserToLocalStorage(user_key, user);

    if (authguard(user.token) && adminGuard(user)) {
      window.location.href = "/src/app/components/admin/admin.html";
    } else if (authguard(user.token) && managerGuard(user)) {
      window.location.href = "/src/app/components/manager/manager.html";
    } else if (authguard(user.token)) {
      window.location.href = "/src/app/components/viewer/viewer.html";
    } else {
      console.log("user not authorized");
      console.log("user not authorized");
      console.log("authguard(user.token):", authguard(user.token));
      console.log("adminGuard(user):", adminGuard(user));
      console.log("managerGuard(user):", managerGuard(user));
      return;
    }
  } catch (error) {
    console.error(error.messsage);
  }
});
