const express = require("express");
const router = express.Router();
const {addTask, getTask, updateTask, deleteTask} = require("../controllers/task.controller");

router.post("/", addTask)

router.get("/", getTask)
router.get("/:id/", getTask)
router.get("/:id/:taskId", getTask)

router.patch("/:id/:taskId", updateTask)

router.delete("/:id/:taskId", deleteTask)

module.exports = router