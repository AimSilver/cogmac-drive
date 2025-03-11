import dotenv from "dotenv";
dotenv.config();
import asyncHandler from "express-async-handler";
import axios from "axios";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator";
import { Auth, authModel } from "../models/auth.model";
import { User, userModel } from "../models/user.model";
import { HTTP_BAD_REQUEST, HTTP_UNAUTHORIZED } from "../constants/http_status";
import { userMgmtModel } from "../models/user-management.model";

/* ...........................................................................
.............................................................................. */

// method for login
export const signin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log("req recieved");
  console.log(email, password);
  const sanitizedEmail = validator.trim(validator.escape(email));
  const sanitizedPassword = validator.trim(validator.escape(password));
  if (!validator.isEmail(sanitizedEmail)) {
    res.status(HTTP_BAD_REQUEST).send({ message: "Invalid Email address" });
    return;
  }
  if (sanitizedPassword.length < 8) {
    res
      .status(HTTP_BAD_REQUEST)
      .send({ message: "Password must be at least 8 characters long" });
    return;
  }
  const auth = await authModel.findOne({
    email: sanitizedEmail,
  });

  const user = await userModel.findOne({ email: sanitizedEmail });
  if (!(auth && user)) {
    res.status(HTTP_BAD_REQUEST).send({ message: "user not found!" });
    return;
  }
  const userId = user.id;
  const userActive = await userMgmtModel.findOne({ userId });
  if (!userActive) {
    res
      .status(HTTP_BAD_REQUEST)
      .send({ message: "User management records not found" });
    return;
  }

  if (!userActive?.isActive) {
    res.status(HTTP_BAD_REQUEST).send({ message: "user is blocked by admin" });
    return;
  }
  if (await bcrypt.compare(sanitizedPassword, auth.password)) {
    res.send(generateTokenResponse(auth, user));
  } else {
    res
      .status(HTTP_BAD_REQUEST)
      .send({ message: "username or password is not valid!" });
    return;
  }
});

/* ....................................................................................
....................................................................................... */

// method for google signin
export const googleSignin = asyncHandler(async (req, res) => {
  console.log("req, recieved for authorization of google", req.body);
  try {
    const { code } = req.body;
    const response = await axios.post("https://oauth2.googleapis.com/token", {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: "authorization_code",
    });
    const { access_token } = response.data;
    console.log(access_token, "acces token");
    const userResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      { headers: { Authorization: `Bearer ${access_token}` } }
    );
    const userDetails = userResponse.data;
    console.log(userDetails, "user details");
    if (userDetails.email_verified === false) {
      res.status(HTTP_UNAUTHORIZED).send({ message: "user is not verified" });
      return;
    }
    const auth = await authModel.findOne({
      email: userDetails.email,
    });

    const user = await userModel.findOne({ email: userDetails.email });
    if (!(auth && user)) {
      res.status(HTTP_BAD_REQUEST).send({ message: "user not found!" });
      return;
    }
    const userId = user.id;
    const userActive = await userMgmtModel.findOne({ userId });
    if (!userActive) {
      res
        .status(HTTP_BAD_REQUEST)
        .send({ message: "User management records not found" });
      return;
    }

    if (!userActive?.isActive) {
      res
        .status(HTTP_BAD_REQUEST)
        .send({ message: "user is blocked by admin" });
      return;
    }
    res.send(generateTokenResponse(auth, user, userDetails.picture));
  } catch (error) {
    console.error("Error during authentication:", error);
    res.status(500).json({ message: "Failed to authenticate" });
  }
});
// method for updating user details

export const updateAccountDetails = asyncHandler(async (req: any, res) => {
  console.log("req recived for updating user details :", req.body);
  const { userId, authId } = req.user;
  const { name, email, password } = req.body;
  if (!name || !email || !password || !userId || !authId) {
    res.status(HTTP_BAD_REQUEST).send({ message: "All fields are required" });
    return;
  }
  const sanitizedUsername = validator.trim(validator.escape(name));
  const sanitizedEmail = validator.trim(validator.escape(email));
  const sanitizedPassword = validator.trim(validator.escape(password));
  if (!validator.isEmail(sanitizedEmail)) {
    res.status(HTTP_BAD_REQUEST).send({ message: "Invalid email address" });
    return;
  }
  if (sanitizedPassword.length < 8) {
    res
      .status(HTTP_BAD_REQUEST)
      .send({ message: "Password must be at least 8 characters long" });
    return;
  }
  if (!sanitizedUsername || sanitizedUsername.length === 0) {
    res.status(HTTP_BAD_REQUEST).send({ message: "Username is required" });
    return;
  }
  const encryptedPassword = await bcrypt.hash(sanitizedPassword, 10);
  const updatedUser = await userModel.findByIdAndUpdate(
    userId,
    { name: sanitizedUsername, email: sanitizedEmail },
    { new: true, runValidators: true }
  );
  const updatedAuth = await authModel.findByIdAndUpdate(
    authId,
    {
      email: sanitizedEmail,
      password: encryptedPassword,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatedUser && !updatedAuth) {
    res
      .status(HTTP_BAD_REQUEST)
      .send({ message: "Failed Updating user's detail" });
    return;
  }
  console.log("updated", updatedAuth, updatedUser);
  res.status(200).json({
    message: "Successfully updated user's detail",
    key: "User",
    user: generateTokenResponse(updatedAuth!, updatedUser!),
  });
});

// method for renaming user
export const renameUser = asyncHandler(async (req: any, res) => {
  console.log("req recieved for renaming user");
  const { userId } = req.user;
  const { name } = req.body;
  if (!userId || !name) {
    res.status(HTTP_BAD_REQUEST).send({ message: "!All fields are required" });
  }
  const sanitizedUsername = validator.trim(validator.escape(name));
  const renamedUser = await userModel.findByIdAndUpdate(
    userId,
    {
      name: sanitizedUsername,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!renamedUser) {
    res.status(HTTP_BAD_REQUEST).send({ message: "!User not found" });
    return;
  }
  console.log("updatedname", renamedUser.name);
  res.send({
    message: `Succesfully renamed to ${renamedUser.name}`,
    updatedName: renamedUser?.name,
  });
});

// method fo handling download token request
export const requestForDownloadToken = asyncHandler(async (req: any, res) => {
  console.log("req recieved for generating download token");
  const { userId, email } = req.user;
  const fileId = req.query.fileId;
  if (!userId && !email && !fileId) {
    res
      .status(HTTP_BAD_REQUEST)
      .send({ message: "userid missing credentials " });
    return;
  }
  const { downloadToken } = generateDownloadTokenResponse(
    userId,
    email,
    fileId
  );
  res.send({ downloadToken });
});

// method for generating token for viewing file

export const requestForViewFileToken = asyncHandler(async (req: any, res) => {
  console.log("req recieved for generating viefile token");
  const { userId, email } = req.user;
  const fileId = req.query.fileId;
  if (!fileId && !userId && !email) {
    res.status(HTTP_BAD_REQUEST).send({ message: "missing credentials" });
    return;
  }
  const { viewFileToken } = generateViewFiletokenResponse(
    userId,
    fileId,
    email
  );
  res.send({ token: viewFileToken });
});

/* ....................................................................................
....................................................................................... */

// function for genertaing jwt token for login
const generateTokenResponse = (auth: Auth, user: User, picture?: string) => {
  const token = jwt.sign(
    {
      userId: user.id,
      authId: auth.id,
      email: user.email,
      isAdmin: auth.isAdmin,
      isManager: auth.isManager,
    },
    process.env.JWT_SECRET || "fallback-sercret-key",
    {
      expiresIn: "1hr",
    }
  );
  return {
    userId: user.id,
    authId: auth.id,
    email: user.email,
    username: user.name,
    isAdmin: auth.isAdmin,
    isManager: auth.isManager,
    token: token,
    picture: picture,
  };
};

const generateDownloadTokenResponse = (
  userId: string,
  email: string,
  fileId: string
) => {
  const downloadToken = jwt.sign(
    {
      userId: userId,
      email: email,
      fileId: fileId,
    },
    process.env.JWT_SECRET || "fallback-download-key",
    {
      expiresIn: "1m",
    }
  );
  return { downloadToken };
};

const generateViewFiletokenResponse = (
  userId: string,
  fileId: string,
  email: string
) => {
  const viewFileToken = jwt.sign(
    { userId: userId, fileId: fileId, email: email },
    process.env.JWT_SECRET || "fallback-viewFile-key",
    {
      expiresIn: "30m",
    }
  );
  return { viewFileToken };
};
