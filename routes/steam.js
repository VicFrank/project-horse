const express = require("express");
const router = express.Router();
const axios = require("axios");
const apicache = require("apicache");

let cache = apicache.middleware;

router.get("/changelog", cache("5 minutes"), async (req, res) => {
  try {
    const API_URL =
      "https://www.dota2.com/webapi/IWorkshop/GetChangeLog/v0001/?fileid=2865676075";
    const request = await axios.get(API_URL);
    res.status(200).json(request.data);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

module.exports = router;
