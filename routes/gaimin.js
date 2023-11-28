const express = require("express");
const router = express.Router();
const Gaimin = require("../db/gaimin");

router.get("/generate_code", async (req, res) => {
  try {
    const steamID = req.query.steam_id;
    const code = await Gaimin.generateCode(steamID);
    res.status(200).send(code);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() });
  }
});

router.get("/validate_code", async (req, res) => {
  try {
    const { code, steam_id } = req.query;
    const isValid = await Gaimin.checkCode(code, steam_id);
    if (isValid) {
      res.status(200).send(true);
    } else return res.status(200).send(false);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() });
  }
});

module.exports = router;
