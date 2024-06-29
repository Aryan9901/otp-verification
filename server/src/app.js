const express = require("express");
const cors = require("cors");
const app = express();

app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
	})
);

app.use(express.json());

const userRouter = require("./routes/user.routes");

app.use("/api/v1/user", userRouter);

module.exports = app;
