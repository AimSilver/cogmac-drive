import { getTokenUserFromLocalStorage } from "../functions.js";
import { postFetchmethod } from "../methods/fetchMethods.js";

export async function downloadFileService(url, fileName, fileId) {
  const { downloadToken } = await requestDownloadToken(fileId);
  if (!downloadToken) {
    console.log("not authorized to download");
    return;
  }
  const downloadUrl = `${url}?acces_token=${encodeURIComponent(downloadToken)}`;
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  console.log("Download triggered:", fileName);
}
// requesting for dwonload token
async function requestDownloadToken(fileId) {
  const url = `/getDownloadToken?fileId=${encodeURIComponent(fileId)}`;
  const { serverResponse } = await postFetchmethod(url);
  return { downloadToken: serverResponse.downloadToken };
}
