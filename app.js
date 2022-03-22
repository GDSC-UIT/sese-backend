const express = require("express");
const cors = require("cors");
require("dotenv").config();
const morgan = require("morgan");

const globalErrorHandler = require("./src/middlewares/globalErrorHandler");
const AppError = require("./src/utils/AppError");
const {
  authRoute,
  userRoute,
  postRoute,
  categoryRoute,
  conversationRoute,
} = require("./src/routes/user");
const adminRoute = require("./src/routes/admin");
//Config
const app = express();
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  res.send("HELLO STUREE");
});
app.use("/api/admin", adminRoute);
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/conversations", conversationRoute);

app.all("*", (req, res, next) => {
  const error = new AppError(
    `Can't find ${req.originalUrl} on this server`,
    404
  );
  next(error);
});

app.use(globalErrorHandler);

module.exports = app;
