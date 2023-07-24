require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const { errorHandler } = require("./utils/handle-error");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.DB_URI)
  .catch(({ message }) =>
    console.error("😐 initial connection error: 👇 \n", message)
  );
mongoose.connection.on("error", ({ message }) => {
  console.error("😐 connection error: 👇 \n", message);
});
mongoose.connection.once("open", () => {
  console.log("connected to database 🎉");
  app.listen(process.env.PORT, () => {
    console.log(`👉 http://localhost:${process.env.PORT}`);
    console.log(`⚡ http://localhost:${process.env.PORT}/api`);
  });
});

app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/legal-entity", require("./routes/legal-entity.route"));

app.get("/", (_, res) => res.send("👋 welcome to the api"));
app.use(errorHandler);
