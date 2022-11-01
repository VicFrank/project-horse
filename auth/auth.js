const keys = require("../config/keys");

const isTestClient = (req) => {
  const serverKey = req.body.server_key;
  const serverKey2 = req.get("server_key");
  const serverKey3 = req.params.server_key;
  const serverKey4 = req.query.server_key;
  const testDedicatedServerKey = process.env.IS_PRODUCTION
    ? keys.dedicatedServerKey
    : keys.toolsKey;

  return (
    serverKey === testDedicatedServerKey ||
    serverKey2 === testDedicatedServerKey ||
    serverKey3 === testDedicatedServerKey ||
    serverKey4 === testDedicatedServerKey
  );
};

const isProdClient = (req) => {
  const serverKey = req.body.server_key;
  const serverKey2 = req.get("server_key");
  const serverKey3 = req.params.server_key;
  const serverKey4 = req.query.server_key;
  const prodDedicatedServerKey = process.env.IS_PRODUCTION
    ? keys.prodDedicatedServerKey
    : keys.toolsKey;

  return (
    serverKey === prodDedicatedServerKey ||
    serverKey2 === prodDedicatedServerKey ||
    serverKey3 === prodDedicatedServerKey ||
    serverKey4 === prodDedicatedServerKey
  );
};

function checkServerKey(req) {
  return isTestClient(req) || isProdClient(req);
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
  isProdClient,
  isTestClient,
  adminAuth: function (req, res, next) {
    if (req.user?.isAdmin) {
      return next();
    } else {
      res
        .status(403)
        .send({ message: `You are not authorized to add/change data` });
      return;
    }
  },
  keyAuth: function (req, res, next) {
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
  statsManAuth: function (req, res, next) {
    if (checkServerKey(req)) {
      return next();
    } else if (req.user?.isAdmin) {
      return next();
    } else if (req.user?.userType == "STATS_GUY") {
      return next();
    } else {
      res
        .status(403)
        .send({ message: `You are not authorized to access this data` });
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
