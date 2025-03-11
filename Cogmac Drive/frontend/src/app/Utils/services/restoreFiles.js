import { authguard } from "../Guards/authGuard.js";
import { getTokenUserFromLocalStorage } from "../functions.js";
import { managerGuard } from "./managerGuard.js";
import { patchFetchMethod } from "../methods/fetchMethods.js";
import { deleteRestoreSelectedFileContainer } from "../../components/manager/constants.js";
import { trashContainerInitializer } from "../../components/manager/trash/trash.js";

export async function restoreFileService(url) {
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
// function for restoring all selected files
export async function restoreAllSelectedFilesService(data) {
  const url = "/restoreAllSelectedFiles";
  const callbackFn = async (erroData) => {
    alert(`!failed : \n "${erroData.message}"`);

    deleteRestoreSelectedFileContainer.style.display = "none";
    await trashContainerInitializer();
  };
  const { message } = await patchFetchMethod(url, data, callbackFn);
  if (!message) {
    console.log("no response from server");
  }
  alert(`!success : \n "${message}"`);
}
