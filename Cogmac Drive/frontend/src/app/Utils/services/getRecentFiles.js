import { getTokenUserFromLocalStorage } from "../functions.js";
import { authguard } from "../Guards/authGuard.js";
import { managerGuard } from "./managerGuard.js";
import { getFetchMethod } from "../methods/fetchMethods.js";
export async function getRecentFilesService() {
  const { token, user } = getTokenUserFromLocalStorage();
  if (!authguard(token) && !managerGuard(user)) {
    console.log("User and req unauthorized");
  }
  const url = "/getRecentFiles";
  const { data } = await getFetchMethod(url);
  if (!data) {
    console.log("failed to fetch data for recent files ");
  }
  return { recentFiles: data };
}
