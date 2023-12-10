const express = require("express");
const router = express.Router();
const authenticateToken = require("../controllers/auth");

router.get("/", authenticateToken, (req, res) => {
  res.json({
    user: req.user,
    accessToken: req.newAccessToken || req.user,
  });
});

module.exports = router;
