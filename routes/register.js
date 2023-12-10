const express = require("express");
const router = express.Router();
const User = require("../models/user.js");

router.post("/", async function (req, res) {
  const { name, email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email: email } });
    if (user) {
      return res
        .status(409)
        .json({ success: false, message: "User Already Exists" });
    }
    if (!user) {
      try {
        const newUser = await User.create({
          name:name,
          email: email,
          password: password,
        });
        await newUser.save();

        // alert("User Created Successfully");
        return res.status(200).json({ success: true, message: "User Created Successfully" });
      } catch (error) {
        console.log(error);
        return res
          .status(501)
          .json({ success: false, message:"unable to login" });
      }
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;
