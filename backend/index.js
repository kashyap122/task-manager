require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("./db"); //import mongoDB connection

const taskRoutes = require("./routes/tasks");
const authRoutes = require("./routes/auth");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Task Manager Home Page!!" });
});

//Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🟢 Server running on port ${PORT}`));
