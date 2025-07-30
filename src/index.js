const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./application/routes/authRoutes");
const taskRouters = require("./application/routes/taskRoutes")
const db = require("./data/data-sources/db-datasource/database");

const app = express();
app.use(bodyParser.json());

app.use("/api/auth", authRoutes);
app.use("/api/task", taskRouters)

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
  db();
});
