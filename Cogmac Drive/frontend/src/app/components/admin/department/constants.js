//department constants
/* for department we are using  const inside getdeptelement function to fetch these
const after initializedeptcont function initialize ,as they exists after include html function
include them in main html file  and include html function also initilaize intializedeptcont fn */
export function getDeptElements() {
  return {
    closeButton: document.getElementById("closeBtn"),
    deptcontainer: document.querySelectorAll(".dept-container")[0],
  };
}
export const confirmDeleteDept = document.getElementById("confirmDeleteButton");
