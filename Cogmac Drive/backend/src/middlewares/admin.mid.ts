import { HTTP_UNAUTHORIZED } from "../constants/http_status";
import authMid from "./auth.mid";
const adminMid = (req: any, res: any, next: any) => {
  console.log("request recied to verify admin", req.user);

  if (!req.user.isAdmin) {
    res
      .status(HTTP_UNAUTHORIZED)
      .send({ message: "Unauthorized acces,not an Admin" });
  } else {
    console.log("admin verification done");
    return next();
  }
  //   export both middleware,The array represents the order in which these middlewares should be executed.
};
export default [authMid, adminMid];
