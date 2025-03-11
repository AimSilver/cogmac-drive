import { deleteRestoreSelectedFileContainer } from "../../components/manager/constants.js";
import { trashContainerInitializer } from "../../components/manager/trash/trash.js";
import { authguard } from "../Guards/authGuard.js";
import { getTokenUserFromLocalStorage } from "../functions.js";
import { managerGuard } from "./managerGuard.js";
import { deleteFetchMethod, postFetchmethod } from "../methods/fetchMethods.js";

export async function deleteFileService(url) {
  const { token, user } = getTokenUserFromLocalStorage();
  if (!authguard(token) && !managerGuard(user)) {
    console.log("unauthorized access");
    return;
  }
  const { message } = await deleteFetchMethod(url);
  if (!message) {
    console.log("server didnot responded");
    return;
  }
  alert(`Success : \n "${message}"`);
}

export async function deleteAllSelectedFilesService(data) {
  const url = "/deleteAllSelectedFiles";
  const callbackFn = async () => {
    $("#trash-deleteConfirmationModal").modal("hide");

    deleteRestoreSelectedFileContainer.style.display = "none";
    await trashContainerInitializer();
  };
  const { serverResponse } = await postFetchmethod(url, data, callbackFn);
  if (!serverResponse) {
    console.log("server not responding");

    return;
  }
  alert(`!success : \n "${serverResponse.message}"`);
}
