import { getTokenUserFromLocalStorage } from "../functions.js";
// to check if request made by a token user
export function authguard(requiredtoken) {
  const { token } = getTokenUserFromLocalStorage();
  if (!token === requiredtoken) {
    window.location.href = "http://localhost:3000";
    console.log("unauthorized token access");
    return false;
  }

  return true;
}
