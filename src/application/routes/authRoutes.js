const express = require("express");
const router = express.Router();
const { register, login, changePassword, forgotPassword  } = require("../controllers/auth.controller");

router.post("/register", register);
router.post("/login", login);
router.post("/change-password", changePassword);
router.post("/forgot-password", forgotPassword);

module.exports = router;
