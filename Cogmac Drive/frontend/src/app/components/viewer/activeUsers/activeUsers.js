import { getTokenUserFromLocalStorage } from "../../../Utils/functions.js";
import { getActiveUsersService } from "../../../Utils/services/getActiveUsers.js";

export async function activeUsersInitializer() {
  const activeUsersOffcanvasBodyRow = document.getElementById(
    "offcanvas-body-row-1"
  );
  activeUsersOffcanvasBodyRow.innerHTML = "";
  const { user } = getTokenUserFromLocalStorage();
  const url = `/getActiveUsers?userId=${encodeURIComponent(user.userId)}`;
  const { activeUsers } = await getActiveUsersService(url);

  showActiveUsers(activeUsers);
}

function showActiveUsers(activeUsers) {
  if (!activeUsers) {
    console.log("active users not found ");
    return;
  }
  activeUsers.forEach((user, index) => {
    const activeUsersOffcanvasBodyRow = document.getElementById(
      "offcanvas-body-row-1"
    );

    if (!activeUsersOffcanvasBodyRow) {
      console, log("no active user  row found");
      return;
    }
    activeUsersOffcanvasBodyRow.innerHTML += `


        <div class="row d-flex align-items-center ms-1 ">
           <div class="col d-flex align-items-center">
             <div class="active-users mt-1"></div> &nbsp;
             <span class="lead" style="font-size: 15px !important;cursor: pointer;">${user.userId.name}</span>
           </div>
         
          </div>
         <div class="hr"></div>
    `;
  });
}
