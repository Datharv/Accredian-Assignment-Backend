const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

const refreshTokenSecret = "Refresh_SECRET";
const accessTokenSecret = "Access_SECRET";

async function authenticateToken(req, res, next) {
  const accessToken =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  const refreshToken = req.headers["x-refresh-token"];
  //   console.log(accessToken);
  if (!accessToken && !refreshToken)
    return res.status(401).json({ success: false, message: "Unauthorized" });

  try {
    const user = jwt.verify(accessToken, accessTokenSecret);
    // console.log(user);
    try {
      const user2 = await User.findOne({
        where: { email: user.userEmail, id: user.userId },
      });
      // console.log(user2);
      if (user2) {
        req.user = accessToken;
        // console.log(req.user, "access token verified");
        return next();
      } else
        return res.status(401).json({
          status: false,
          message: "Access Token is get but User not in database",
        });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  } catch (accessTokenError) {
    console.log(accessTokenError);
    if (accessTokenError.name !== "TokenExpiredError") {
      return res
        .status(401)
        .json({ success: false, message: "JsonwebTokenError" });
    }

    try {
      const decodedRefreshToken = jwt.verify(refreshToken, refreshTokenSecret);
      // console.log(decodedRefreshToken, "decoded refresh token");
      try {
        const user2 = await User.findOne({
          where: {
            email: decodedRefreshToken.userEmail,
            id: decodedRefreshToken.userId,
          },
        });
        if (user2) {
          const newAccessToken = jwt.sign(
            {
              userId: decodedRefreshToken.userId,
              userEmail: decodedRefreshToken.userEmail,
            },
            accessTokenSecret,
            {
              expiresIn: "15m",
            }
          );
          req.user = decodedRefreshToken;
          req.newAccessToken = newAccessToken;
          // console.log(req.user, "new access token");
          return next();
        } else
          return res.status(401).json({
            status: false,
            message: "Refresh Token is get but User not in database",
          });
      } catch (error) {
        return res.status(500).json({
          status: false,
          message: "Internal server error",
        });
      }
    } catch (refreshTokenError) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
  }
}
module.exports = authenticateToken;
