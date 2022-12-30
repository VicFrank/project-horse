const keys = require("../config/keys");

const reqMatchesKey = (req, key) => {
  const serverKey = req.body.server_key_v3;
  const serverKey2 = req.get("server_key_v3");
  const serverKey3 = req.params.server_key_v3;
  const serverKey4 = req.query.server_key_v3;
  return (
    serverKey === key ||
    serverKey2 === key ||
    serverKey3 === key ||
    serverKey4 === key
  );
};

const isTestClient = (req) => {
  const key = process.env.IS_PRODUCTION
    ? keys.dedicatedServerKeyV3
    : keys.toolsKey;

  return reqMatchesKey(req, key);
};

const isProdClient = (req) => {
  const key = process.env.IS_PRODUCTION
    ? keys.prodDedicatedServerKeyV3
    : keys.toolsKey;

  return reqMatchesKey(req, key);
};

const isTournamentClient = (req) => {
  const key = process.env.IS_PRODUCTION
    ? keys.tournDedicatedServerKeyV3
    : keys.toolsKey;

  return reqMatchesKey(req, key);
};

function checkServerKey(req) {
  return isTestClient(req) || isProdClient(req) || isTournamentClient(req);
}

function checkUserAuth(req) {
  if (
    process.env.BASE_URL === "https://vicfrank.xyz" ||
    process.env.BASE_URL === "http://localhost:8080"
  )
    return true;
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
  isTournamentClient,
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
