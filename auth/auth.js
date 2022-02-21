const keys = require("../config/keys");

function checkServerKey(req) {
  const serverKey = req.body.server_key;
  const serverKeyParam = req.params.server_key;
  const dedicatedServerKey = process.env.IS_PRODUCTION
    ? keys.dedicatedServerKey
    : keys.toolsKey;

  return (
    serverKey === dedicatedServerKey || serverKeyParam === dedicatedServerKey
  );
}

function checkUserAuth(req) {
  if (checkServerKey(req)) {
    return true;
  }
  if (req.isAuthenticated()) {
    const steamid = req.params.steamid;
    if (steamid === req.user.id || req.user.isAdmin) {
      return true;
    }
  }
  return false;
}

module.exports = {
  isAuthenticatedUser: function (req) {
    return checkUserAuth(req);
  },
  adminAuth: function (req, res, next) {
    if (checkServerKey(req)) {
      return next();
    } else if (req.user && req.user.isAdmin) {
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
