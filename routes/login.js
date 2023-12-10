const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const refreshTokenSecret = "Refresh_SECRET";
const accessTokenSecret = "Access_SECRET";


router.post("/", async function (req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email: email } });
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        return res.status(200).json({ accessToken, refreshToken });
      } else {
        return res
          .status(401)
          .json({ success: false, message: "Email or pass wrong" });
      }
    } else {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

function generateAccessToken(user) {

  return jwt.sign(
    { userId: user.id, userEmail: user.email },
    accessTokenSecret,
    {
      expiresIn: "15m",
    }
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    { userId: user.id, userEmail: user.email },
    refreshTokenSecret,
    {
      expiresIn: "1y",
    }
  );
}

module.exports = router;
