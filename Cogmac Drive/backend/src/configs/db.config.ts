import { connect } from "mongoose";
require("dotenv").config();
export const dbConnect = () => {
  connect(process.env.MONGO_URL!)
    .then(() => {
      console.log("database connected successfully");
    })
    .catch((error) => {
      console.log("datbase connection failed");
      console.error(error);
    });
};
