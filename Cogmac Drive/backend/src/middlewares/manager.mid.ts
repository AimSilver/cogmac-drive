import { HTTP_UNAUTHORIZED } from "../constants/http_status";
import authMid from "./auth.mid";
const managerMid = (req: any, res: any, next: any) => {
  console.log("request recied to verify Manager", req.user);

  if (!req.user.isManager) {
    res
      .status(HTTP_UNAUTHORIZED)
      .send({ message: "Unauthorized acces,not an Manager" });
  } else {
    console.log("Manager verification done");
    return next();
  }
  //   export both middleware,The array represents the order in which these middlewares should be executed.
};
export default [authMid, managerMid];
