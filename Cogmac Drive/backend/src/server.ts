import dotenv from "dotenv";
dotenv.config();
import path from "path";
import express from "express";

import cors from "cors";
import liveReload from "livereload";
import connectLiveReload from "connect-livereload";

import adminRoutes from "./routes/admin.route";
import authRoutes from "./routes/auth.route";
import fileRoutes from "./routes/file.route";
import trashRoutes from "./routes/trash.routes";
import userRoutes from "./routes/viewer.routes";
import managerRoutes from "./routes/manager.routes";

import { dbConnect } from "./configs/db.config";

dbConnect();
const app = express();
const liveReloadServer = liveReload.createServer({
  exclusions: [new RegExp(path.join(__dirname, "./uploads"))],
});
app.use(express.json());
app.use(
  cors({
    origin: "http//localhost:3000",
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(connectLiveReload());
app.use(express.static(path.join(__dirname, "../../frontend")));

app.use(adminRoutes);

app.use(authRoutes);
app.use(fileRoutes);

app.use(trashRoutes);
app.use(userRoutes);
app.use(managerRoutes);

app.get("/", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "../../frontend/src/app/components/index",
      "index.html"
    )
  );
});
console.log("process port", process.env.PORT);
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("server successfully started at http://localhost:3000");
  const pth = path.join(__dirname, "./uploads");
  console.log(pth);
});
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});
