const { query } = require("./index");
const Cosmetics = require("./cosmetics");

module.exports = {
  async getSaleItem() {
    try {
      // get the item that is currently on sale
      const { rows } = await query(`
      SELECT * FROM sales
      WHERE start_date <= NOW()
        AND end_date >= NOW()        
      `);
      const cosmeticID = rows[0]?.cosmetic_id;
      if (!cosmeticID) return null;
      const cosmetic = await Cosmetics.getCosmetic(cosmeticID);
      return {
        ...cosmetic,
        cost_coins: rows[0].cost_coins,
        expiration: rows[0].end_date,
      };
    } catch (error) {
      throw error;
    }
  },

  async getSales() {
    try {
      const { rows } = await query(
        `SELECT sales.*, cosmetics.cosmetic_name FROM sales JOIN cosmetics using (cosmetic_id)`
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async addSaleItem(cosmeticID, costCoins, startDate, endDate) {
    try {
      if (startDate >= endDate) throw new Error("Invalid sale time");
      if (startDate == null) throw new Error("Invalid sale time");
      if (endDate == null) throw new Error("Invalid sale time");
      if (endDate < new Date()) throw new Error("Invalid sale time");

      // make sure there aren't any existing sales in this time period
      const sales = await this.getSales();
      for (const sale of sales) {
        if (
          (startDate > sale.start_date && startDate < sale.end_date) ||
          (endDate > sale.start_date && endDate < sale.end_date)
        ) {
          throw new Error("Sale time conflicts with existing sale");
        }
      }

      await query(
        `INSERT INTO sales (cosmetic_id, start_date, end_date, cost_coins) VALUES ($1, $2, $3, $4)`,
        [cosmeticID, startDate, endDate, costCoins]
      );
    } catch (error) {
      throw error;
    }
  },

  async updateSaleItem(saleID, cosmeticID, costCoins, startDate, endDate) {
    try {
      if (startDate >= endDate) throw new Error("Invalid sale time");
      if (startDate == null) throw new Error("Invalid sale time");
      if (endDate == null) throw new Error("Invalid sale time");
      if (endDate < new Date()) throw new Error("Invalid sale time");

      // make sure there aren't any existing sales in this time period
      const sales = await this.getSales();
      for (const sale of sales) {
        if (
          (startDate > sale.start_date && startDate < sale.end_date) ||
          (endDate > sale.start_date && endDate < sale.end_date)
        ) {
          throw new Error("Sale time conflicts with existing sale");
        }
      }

      await query(
        `UPDATE sales
        SET cosmetic_id = $1, start_date = $2, end_date = $3, cost_coins = $4
        WHERE sale_id = $5`,
        [cosmeticID, startDate, endDate, costCoins, saleID]
      );
    } catch (error) {
      throw error;
    }
  },

  async deleteSaleItem(saleID) {
    try {
      await query(`DELETE FROM sales WHERE sale_id = $1`, [saleID]);
    } catch (error) {
      throw error;
    }
  },
};
