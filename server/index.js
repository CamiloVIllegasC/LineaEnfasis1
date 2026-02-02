import express from "express";
import logger from "morgan";
import dotenv from "dotenv";
import router from "./routes/citas.routes.js";

dotenv.config();
const port = process.env.PORT ?? 3000;

const app = express();
app.use(logger("dev"));
app.use(express.json());
app.use("/", router);

app.get("/", (req, res) => {
  res.send("<h1>Citas</h1>");
});

app.listen(port, () => {
  console.log("Server running on port", port);
});
