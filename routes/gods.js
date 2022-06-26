const express = require("express");
const router = express.Router();
const auth = require("../auth/auth");
const Gods = require("../db/gods");

router.get("/", async (req, res) => {
  try {
    const gods = await Gods.getAllGods();
    res.status(200).json(gods);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.post("/:name/set_enabled", auth.adminAuth, async (req, res) => {
  try {
    const name = req.params.name;
    const enabled = req.query.enabled;
    const god = await Gods.setEnabled(name, enabled);
    res.status(200).json(god);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.post("/:name/set_is_free", auth.adminAuth, async (req, res) => {
  try {
    const name = req.params.name;
    const isFree = req.query.isFree;
    const god = await Gods.setIsFree(name, isFree);
    res.status(200).json(god);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.post("/:name/set_plus_exclusive", auth.adminAuth, async (req, res) => {
  try {
    const name = req.params.name;
    const plusExclusive = req.query.plusExclusive;
    const god = await Gods.setPlusExclusive(name, plusExclusive);
    res.status(200).json(god);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.delete("/:name", auth.adminAuth, async (req, res) => {
  try {
    const name = req.params.name;
    const stats = await Gods.delete(name);
    res.status(200).json(stats);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

module.exports = router;
