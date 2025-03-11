import { verify } from "jsonwebtoken";
import { HTTP_UNAUTHORIZED } from "../constants/http_status";

export default (req: any, res: any, next: any) => {
  console.log("req recieved for verifying token");
  // extracting the json token from req.headers
  // sending token in headers from forntend as acess_token
  const token = req.headers.acces_token as string;
  // console.log("token", token);
  if (!token) {
    res.status(HTTP_UNAUTHORIZED).send({ message: "!Unauthorized access" });
    return;
  }
  try {
    const JWT_SECRET = process.env.JWT_SECRET!;
    // verify the token
    const decodedUser = verify(token, JWT_SECRET);
    // console.log("Decoded user:", decodedUser);
    // verification succesful
    req.user = decodedUser;
    console.log(decodedUser, "authmid");
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(HTTP_UNAUTHORIZED).send({ message: "!Unauthorized access" });
    return;
  }

  //   continue to the next middleware handler
  console.log("auth verification done");
  return next();
};
