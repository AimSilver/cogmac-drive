import { postFetchmethod } from "../methods/fetchMethods.js";

export async function viewFileService(
  fileType,
  fileId,
  fileIndex,
  viewFileModalBody
) {
  if (!fileType && !fileId && !fileIndex) {
    console.log("credentials missing");
    return;
  }
  console.log("credentials", fileId, fileIndex, fileType);

  const { token } = await requestViewFileToken(fileId);
  if (!token) {
    console.log("view file token not found");
    return;
  }
  const url = `/viewFiles?acces_token=${encodeURIComponent(token)}`;

  if (fileType.startsWith("video")) {
    viewFileModalBody.innerHTML += `
          <video id="videoPlayer-${fileIndex}" style="width:100%;height:90%;" controls>
      <source src="/viewVideo?acces_token=${encodeURIComponent(
        token
      )}" type="video/mp4">
      Your browser does not support the video tag.
    </video>
    
          
          `;
  } else if (fileType.startsWith("image")) {
    viewFileModalBody.innerHTML += ` <img id="imageViewer-${fileIndex}" src="${url}" style="width:100%;height:90%;" alt="Image"> `;
  } else if (fileType === "application/pdf") {
    viewFileModalBody.innerHTML += ` <iframe id="pdfViewer-${fileIndex}" src="${url}" style="width:100%;height:90%;" frameborder="0"></iframe> `;
  } else if (
    fileType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    viewFileModalBody.innerHTML += ` <iframe id="docxViewer-${fileIndex}" src="https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
      url
    )}" style="width:100%;height:90%;" frameborder="0"></iframe> `;
  } else if (fileType === "text/plain") {
    const response = await fetch(url);
    const textContent = await response.text();
    viewFileModalBody.innerHTML += ` <pre id="txtViewer-${fileIndex}" style="width:100%;height:90%;overflow:auto;">${textContent}</pre> `;
  } else {
    viewFileModalBody.innerHTML += `<p>Unsupported file type.</p>`;
  }
}
async function requestViewFileToken(fileId) {
  const url = `/getViewFileToken?fileId=${encodeURIComponent(fileId)}`;

  const { serverResponse } = await postFetchmethod(url);
  if (!serverResponse) {
    console.log("server didnot responded");
    return;
  }
  return { token: serverResponse.token };
}
