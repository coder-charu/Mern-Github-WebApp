import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoute from "./routes/user.route.js";

dotenv.config();

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is ready!!");
});
// fixed routes endpoint via middleware "use"
app.use("/api/users", userRoute);

app.listen(4000, () => {
  console.log("Server started on http://localhost:4000");
});
