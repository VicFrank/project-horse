const express = require("express");
const router = express.Router();
const auth = require("../auth/auth");
const gods = require("../db/gods");

router.get("/", async (req, res) => {
  try {
    const gods = await gods.getAllGods();
    res.status(200).json(gods);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.post("/:name/set_disabled", auth.adminAuth, async (req, res) => {
  try {
    const name = req.params.name;
    const disabled = req.query.disabled;
    const stats = await gods.setDisabled(name, disabled);
    res.status(200).json(stats);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.post("/:name/set_is_free", auth.adminAuth, async (req, res) => {
  try {
    const name = req.params.name;
    const isFree = req.query.isFree;
    const stats = await gods.setIsFree(name, isFree);
    res.status(200).json(stats);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.delete("/:name", auth.adminAuth, async (req, res) => {
  try {
    const name = req.params.name;
    const stats = await gods.delete(name);
    res.status(200).json(stats);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

module.exports = router;
