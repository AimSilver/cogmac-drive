import { getFetchMethod } from "../methods/fetchMethods.js";

export async function getUserFilesService(url) {
  if (!url) {
    console.log("url not provided for fetching users files");
  }
  const { data } = await getFetchMethod(url);
  if (!data) {
    console.log("failed to fetch userfiles or no user files found");
  }
  return { userFiles: data.userFiles };
}
