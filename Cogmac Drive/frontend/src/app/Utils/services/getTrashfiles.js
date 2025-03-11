import { getTokenUserFromLocalStorage } from "../functions.js";
import { getFetchMethod } from "../methods/fetchMethods.js";

export async function getTrashFilesService(url) {
  const { data: trashFiles } = await getFetchMethod(url);
  if (!trashFiles) {
    console.log("trashfiles not found");
  }
  return { trashFiles };
}
