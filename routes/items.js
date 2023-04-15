const express = require("express");
const router = express.Router();
const items = require("../db/items");

router.get("/", async (req, res) => {
  try {
    const result = await items.getItems();
    res.status(200).send(result);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() });
  }
});

module.exports = router;
