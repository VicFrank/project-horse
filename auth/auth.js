const keys = require("../config/keys");

function checkServerKey(req) {
  const serverKey = req.body.server_key;
  const serverKey2 = req.get("server_key");
  const serverKey3 = req.params.server_key;
  const serverKey4 = req.query.server_key;
  const testDedicatedServerKey = process.env.IS_PRODUCTION
    ? keys.dedicatedServerKey
    : keys.toolsKey;
  const prodDedicatedServerKey = process.env.IS_PRODUCTION
    ? keys.prodDedicatedServerKey
    : keys.toolsKey;

  return (
    serverKey === "Invalid_NotOnDedicatedServer" ||
    serverKey2 === "Invalid_NotOnDedicatedServer" ||
    serverKey3 === "Invalid_NotOnDedicatedServer" ||
    serverKey4 === "Invalid_NotOnDedicatedServer" ||
    serverKey === prodDedicatedServerKey ||
    serverKey2 === prodDedicatedServerKey ||
    serverKey3 === prodDedicatedServerKey ||
    serverKey4 === prodDedicatedServerKey ||
    serverKey === testDedicatedServerKey ||
    serverKey2 === testDedicatedServerKey ||
    serverKey3 === testDedicatedServerKey ||
    serverKey4 === testDedicatedServerKey
  );
}

function checkUserAuth(req) {
  if (checkServerKey(req)) return true;
  if (req.user?.isAdmin) return true;
  if (req.isAuthenticated()) {
    const steamID = req.params.steamID;
    if (steamID === req.user.id || req.user.isAdmin) {
      return true;
    }
  }
  return false;
}

module.exports = {
  isAuthenticatedUser: function (req) {
    return checkUserAuth(req);
  },
  isAdmin: function (req) {
    return req.user?.isAdmin;
  },
  adminAuth: function (req, res, next) {
    if (checkServerKey(req)) {
      return next();
    } else if (req.user?.isAdmin) {
      return next();
    } else {
      res
        .status(403)
        .send({ message: `You are not authorized to add/change data` });
      return;
    }
  },
  userAuth: function (req, res, next) {
    if (checkUserAuth(req)) {
      return next();
    }
    res.status(401).send({ message: "Not Authorized" });
  },
};
