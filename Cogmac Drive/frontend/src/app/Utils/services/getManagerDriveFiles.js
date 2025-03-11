import { getFetchMethod } from "../methods/fetchMethods.js";

export async function getAllManagerOwnDriveFilesService() {
  const url = "/getAllManagersOwnDriveFiles";
  const { data } = await getFetchMethod(url);
  if (!data) {
    console.log("failed to fetch managers drive files");
    return;
  }

  return { AllFiles: data };
}
