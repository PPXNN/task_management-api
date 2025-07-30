const express = require("express");
const router = express.Router();
const {add_task, get_task, update_task, delete_task} = require("../controllers/task");

router.post("/", add_task)

router.get("/", get_task)
router.get("/:id/", get_task)
router.get("/:id/:taskId", get_task)

router.patch("/:id/:taskId", update_task)

router.delete("/:id/:taskId", delete_task)

module.exports = router