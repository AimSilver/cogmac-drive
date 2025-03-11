import { authguard } from "../Guards/authGuard.js";
import { getTokenUserFromLocalStorage } from "../functions.js";
import { managerGuard } from "./managerGuard.js";
import { patchFetchMethod } from "../methods/fetchMethods.js";

export async function ChangeFileAccessTypeService(url, data) {
  const { token, user } = getTokenUserFromLocalStorage();
  if (!authguard(token) && !managerGuard(user)) {
    console.log("unauthorized access");
    return;
  }
  const { message } = await patchFetchMethod(url, data);
  if (!message) {
    console.log("failed to change access of files");
  }
  alert(`Success : \n "${message}"`);
}
