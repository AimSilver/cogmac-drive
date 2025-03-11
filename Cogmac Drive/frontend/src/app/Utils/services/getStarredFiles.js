import { getTokenUserFromLocalStorage } from "../functions.js";
import { getFetchMethod } from "../methods/fetchMethods.js";

export async function getStarredFilesService(url) {
  const { data } = await getFetchMethod(url);
  if (!data) {
    console.log("failed to fatch data for starred files");
  }
  return { starredFiles: data };
}
