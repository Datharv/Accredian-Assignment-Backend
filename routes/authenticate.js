const express = require("express");
const router = express.Router();
const authenticateToken = require("../controllers/auth");

router.get("/", authenticateToken, (req, res) => {
  res
    .status(200)
    .json({
      success: true,
      message: "authorized",
      accessToken: req.newAccessToken || req.user,
    });
});

module.exports = router;
