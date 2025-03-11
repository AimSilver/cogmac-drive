import { verify } from "jsonwebtoken";
import { HTTP_UNAUTHORIZED } from "../constants/http_status";

export default (req: any, res: any, next: any) => {
  console.log("req recieved for verifying token");
  // extracting the json token from req.headers
  // sending token in query from forntend as acess_token
  const viewFileToken =
    (req.headers.acces_token as string) || (req.query.acces_token as string);
  // console.log("token", token);
  if (!viewFileToken) {
    res.status(HTTP_UNAUTHORIZED).send({ message: "!Unauthorized access" });
    return;
  }
  try {
    const JWT_SECRET = process.env.JWT_SECRET!;
    // verify the token
    const decodedFile = verify(viewFileToken, JWT_SECRET);
    console.log("Decoded file:", decodedFile);
    // verification succesful
    req.file = decodedFile;
  } catch (error) {
    console.error("viewfile Token verification error:", error);
    res.status(HTTP_UNAUTHORIZED).send({ message: "!Unauthorized access" });
    return;
  }

  //   continue to the next middleware handler
  console.log("viewFIle Token verification done");
  return next();
};
