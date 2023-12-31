require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const { errorHandler } = require("./utils/handle-error");

const app = express();
app.use(
  cors({
    origin: "*",
    methods: "GET, POST, PUT, DELETE, HEAD, OPTIONS",
  })
);
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
app.use("/api/user", require("./routes/user.route"));
app.use("/api/legal-entity", require("./routes/legal-entity.route"));
app.use("/api/house-rules", require("./routes/house-rule.route"));
app.use("/api/facilities", require("./routes/facility.route"));
app.use("/api/properties", require("./routes/property.route"));
app.use("/api/apartments", require("./routes/apartment.route"));
app.use("/api/hotels", require("./routes/hotel.route"));

app.get("/", (_, res) => res.send("👋 welcome to the api"));
app.use(errorHandler);
