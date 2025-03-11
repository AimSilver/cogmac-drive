import { getTokenUserFromLocalStorage } from "../functions.js";
import { patchFetchMethod } from "../methods/fetchMethods.js";

export async function unStarringFileService(url, data) {
  const { message } = await patchFetchMethod(url);
  if (!message) {
    console.log("unstarring failed");
    return;
  }
}
