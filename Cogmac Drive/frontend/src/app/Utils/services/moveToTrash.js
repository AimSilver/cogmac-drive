import { authguard } from "../Guards/authGuard.js";
import { getTokenUserFromLocalStorage } from "../functions.js";
import { managerGuard } from "./managerGuard.js";
import { patchFetchMethod } from "../methods/fetchMethods.js";

export async function moveToTrashService(url) {
  const { token, user } = getTokenUserFromLocalStorage();
  if (!authguard(token) && !managerGuard(user)) {
    console.log("unauthorized access");
    return;
  }
  const { message } = await patchFetchMethod(url);
  if (!message) {
    console.log("server didnt responded");
    return;
  }
  console.log(message);
}
