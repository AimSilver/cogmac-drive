import { getTokenUserFromLocalStorage } from "../functions.js";

// to check if reuest is made by admin
export function adminGuard(user) {
  if (!user.isAdmin) {
    return false;
  }

  return true;
}
