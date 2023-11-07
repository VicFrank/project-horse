const express = require("express");
const router = express.Router();

router.get("/generate_code", async (req, res) => {
  try {
    const randomString = Math.random().toString(36);
    res.status(200).send(randomString);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() });
  }
});

router.post("/validate_code", async (req, res) => {
  try {
    const { code } = req.body;
    if (code === "gaimin") {
      res.status(200).send(true);
      return;
    }
    res.status(200).send(false);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() });
  }
});

module.exports = router;
