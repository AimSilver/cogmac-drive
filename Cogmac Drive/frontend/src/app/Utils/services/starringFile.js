import { patchFetchMethod } from "../methods/fetchMethods.js";

export async function starringFileService(url) {
  const { message } = await patchFetchMethod(url);
  if (!message) {
    console.log("starring file failed");
  }
}
