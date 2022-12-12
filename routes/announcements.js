const express = require("express");
const { adminAuth } = require("../auth/auth");
const router = express.Router();
const announcements = require("../db/announcements");

router.get("/", async (req, res) => {
  try {
    const result = await announcements.getAnnouncements();
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() });
  }
});

router.post("/", adminAuth, async (req, res) => {
  try {
    const result = await announcements.updateAnnouncements(req.body);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() });
  }
});

module.exports = router;
