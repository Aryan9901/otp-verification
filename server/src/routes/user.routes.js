const express = require("express");
const { registerUser, verifyUser, getUser } = require("../controllers/user.controller");

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/verify").post(verifyUser);
router.route("/get/user").post(getUser);

module.exports = router;
