const express = require("express");
const router = express.Router();
const Sales = require("../db/sales");
const auth = require("../auth/auth");

router.get("/", auth.adminAuth, async (req, res) => {
  try {
    const result = await Sales.getSales();
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() });
  }
});

router.get("/current_sale", async (req, res) => {
  try {
    const result = await Sales.getSaleItem();
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() });
  }
});

router.post("/", auth.adminAuth, async (req, res) => {
  try {
    const { cosmetic_id, cost_coins, start_date, end_date } = req.body;
    await Sales.addSaleItem(cosmetic_id, cost_coins, start_date, end_date);
    res.status(201).send();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() });
  }
});

router.post("/:id", auth.adminAuth, async (req, res) => {
  try {
    const saleID = req.params.id;
    const { cosmetic_id, cost_coins, start_date, end_date } = req.body;
    await Sales.updateSaleItem(
      saleID,
      cosmetic_id,
      cost_coins,
      start_date,
      end_date
    );
    res.status(201).send();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() });
  }
});

router.delete("/:id", auth.adminAuth, async (req, res) => {
  try {
    const saleID = req.params.id;
    await Sales.deleteSaleItem(saleID);
    res.status(201).send();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() });
  }
});

module.exports = router;
