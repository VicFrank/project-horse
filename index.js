require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const passport = require("passport");
const session = require("express-session");
const SteamStrategy = require("passport-steam").Strategy;
const pgSession = require("connect-pg-simple")(session);
const http = require("http");
const WebSocket = require("ws");
const keys = require("./config/keys");

const gamesRouter = require("./routes/games");
const playersRouter = require("./routes/players");
const authRouter = require("./routes/auth");
const cosmeticsRouter = require("./routes/cosmetics");
const battlepassRouter = require("./routes/battlepass");
const questsRouter = require("./routes/quests");
const logsRouter = require("./routes/logs");
const paymentsRouter = require("./routes/payments");
const steamRouter = require("./routes/steam");
const leaderboardRouter = require("./routes/leaderboard");
const statsRouter = require("./routes/stats");
const godsRouter = require("./routes/gods");
const redemptionsRouter = require("./routes/redemption-codes");
const announcementsRouter = require("./routes/announcements");
const abilitiesRouter = require("./routes/abilities");

const websocketHandler = require("./websocket/connection");

const players = require("./db/players");
const rollup = require("./db/rollup");
const { pool } = require("./db/index");

const port = 4000;

const app = express();

// Steam OpenID Passport stuff
passport.serializeUser(async (user, next) => {
  // create the user if they don't yet exist
  const steamID = user.id;
  const username = user.displayName;

  const playerExists = await players.doesPlayerExist(steamID);
  if (!playerExists) {
    await players.createPlayer(steamID, username);
  } else {
    await players.updateUsername(steamID, username);
  }

  const { user_type } = await players.getPlayer(steamID);

  // add db info to the user
  user = {
    ...user,
    isAdmin: user_type === "ADMIN",
    userType: user_type,
  };

  next(null, user);
});

passport.deserializeUser((obj, next) => {
  next(null, obj);
});

const baseUrl = process.env.API_URL;
passport.use(
  new SteamStrategy(
    {
      returnURL: `${baseUrl}/api/auth/steam/return`,
      realm: baseUrl,
      apiKey: keys.steamAPIKey,
    },
    (identifier, profile, next) => next(null, profile)
  )
);

const sess = {
  store: new pgSession({
    pool: pool,
  }),
  secret: keys.sessionKey,
  name: "id",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 2592000000, // 30 days
  },
};

if (process.env.IS_PRODUCTION) {
  app.set("trust proxy", 1);
  sess.cookie.secure = true;
}

const sessionParser = session(sess);
app.use(sessionParser);
app.use(passport.initialize());
app.use(passport.session());

function skipLog(req, res) {
  var url = req.url;
  if (url.indexOf("?") > 0) url = url.substr(0, url.indexOf("?"));
  if (url.match(/(js|jpg|png|ico|css|woff|woff2|eot|svg|otf)$/gi)) {
    return true;
  }
  return false;
}

app.use(morgan("short", { skip: skipLog }));

app.use(
  bodyParser.json({
    // Because Stripe needs the raw body, we compute it but only when hitting the Stripe callback URL.
    verify: (req, res, buf) => {
      var url = req.originalUrl;
      if (url.endsWith("/webhook")) {
        req.rawBody = buf.toString();
      }
    },
  })
);
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static(path.join(__dirname, "client/dist")));

app.use("/api/games", gamesRouter);
app.use("/api/players", playersRouter);
app.use("/api/auth", authRouter);
app.use("/api/cosmetics", cosmeticsRouter);
app.use("/api/battle_pass", battlepassRouter);
app.use("/api/quests", questsRouter);
app.use("/api/logs", logsRouter);
app.use("/api/payments", paymentsRouter);
app.use("/api/steam", steamRouter);
app.use("/api/leaderboard", leaderboardRouter);
app.use("/api/stats", statsRouter);
app.use("/api/gods", godsRouter);
app.use("/api/redemption_codes", redemptionsRouter);
app.use("/api/announcements", announcementsRouter);
app.use("/api/abilities", abilitiesRouter);

// Websocket stuff
const server = http.createServer(app);
const wss = new WebSocket.Server({ clientTracking: true, noServer: true });

server.on("upgrade", (req, socket, head) => {
  sessionParser(req, {}, () => {
    if (!req.session.passport) {
      console.log("Session or Passport not found");
      socket.destroy();
      return;
    }

    const user = req.session.passport.user;
    if (!user) {
      console.log("Not logged in");
      socket.destroy();
      return;
    }

    wss.handleUpgrade(req, socket, head, function (ws) {
      wss.emit("connection", ws, user);
    });
  });
});

wss.on("connection", function (ws, user) {
  websocketHandler(ws, user);
});

wss.on("error", function error(error) {
  // console.log(`websocket error ${error}`);
});

// Periodically send heartbeats
const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) {
      // console.log("hearbeat failed, killing");
      return ws.terminate();
    }

    ws.isAlive = false;

    ws.send(JSON.stringify({ event: "ping" }));
  });
}, 30000);

wss.on("close", function close() {
  console.log("close websocket server");
  clearInterval(interval);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/dist/index.html"));
});

const runningServer = server.listen(port, () => {
  console.log(`App running on port ${port}.`);
});

process.on("SIGINT", () => {
  console.info("SIGINT signal received.");

  // Stops the server from accepting new connections and finishes existing connections.
  runningServer.close(function (err) {
    // if error, log and exit with error (1 code)
    if (err) {
      console.error(err);
      process.exit(1);
    }

    // close your database connection and exit with success (0 code)
    pool.end(() => {
      console.log("pool has ended");
      process.exit(0);
    });
  });
});

// Cron job to reset login quests every week, on Monday at 12:00 AM
const cron = require("node-cron");

cron.schedule("0 0 0 * * 1", async () => {
  console.log("Resetting login quests...");
  await players.resetAllLoginQuests();
});

// Cron job to run every 10 minutes and kick lobby players that are afk
// cron.schedule("0 0 0 * * 1", async () => {
//   console.log("Resetting login quests...");
//   await lobbyPlayers.kickAfk();
// });

// Run stats rollup daily at 2am (must be after midnight since it rolls from today - 1)
cron.schedule("0 2 * * *", async () => {
  console.log("Running stats rollup");
  await rollup.runGodRollup();
});