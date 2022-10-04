const tx = require("pg-tx");
const { query, pool } = require("./index");

module.exports = {
  async getAllCosmetics() {
    try {
      const { rows } = await query(
        "SELECT * FROM cosmetics ORDER BY cosmetic_type, cosmetic_name"
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async getCosmetic(cosmeticID) {
    try {
      const { rows } = await query(
        "SELECT * FROM cosmetics WHERE cosmetic_id = $1",
        [cosmeticID]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  async getCosmetics(cosmeticIDs) {
    try {
      const promises = [];
      for (const cosmeticID of cosmeticIDs) {
        // check if cosmeticID is a number greater than 0
        if (isNaN(cosmeticID) || cosmeticID < 1) {
          throw new Error(`Invalid cosmeticID: ${cosmeticID}`);
        }
        promises.push(this.getCosmetic(cosmeticID));
      }
      const cosmetics = await Promise.all(promises);
      return cosmetics;
    } catch (error) {
      throw error;
    }
  },

  async getPurchaseableXpItems() {
    const xpItems = ["buy_xp_5000", "buy_xp_1000", "buy_xp_300"];
    try {
      const promises = [];
      for (const cosmeticName of xpItems) {
        promises.push(this.getCosmeticByName(cosmeticName));
      }
      const cosmetics = await Promise.all(promises);
      return cosmetics.map((cosmetic) => ({
        ...cosmetic,
        xp: Number(cosmetic.cosmetic_name.slice(7)),
      }));
    } catch (error) {
      throw error;
    }
  },

  async getCosmeticByName(cosmeticName) {
    try {
      const { rows } = await query(
        `SELECT * FROM cosmetics WHERE cosmetic_name = $1`,
        [cosmeticName]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  async getCosmeticName(cosmeticID) {
    try {
      const { rows } = await query(
        `SELECT cosmetic_name FROM cosmetics WHERE cosmetic_name = $1`,
        [cosmeticID]
      );
      return rows[0]?.cosmetic_name;
    } catch (error) {
      throw error;
    }
  },

  async getCosmeticPrice(cosmeticID) {
    try {
      const { rows } = await query(
        `SELECT cost_usd FROM cosmetics WHERE cosmetic_id = $1`,
        [cosmeticID]
      );
      const item = rows[0];
      return item?.cost_usd;
    } catch (error) {
      throw error;
    }
  },

  async exists(cosmeticName) {
    try {
      const { rows } = await query(
        `SELECT * FROM cosmetics WHERE cosmetic_name = $1`,
        [cosmeticName]
      );
      return rows.length > 0;
    } catch (error) {
      throw error;
    }
  },

  async getEquipGroup(cosmeticID) {
    try {
      const { rows } = await query(
        `SELECT equip_group FROM cosmetics WHERE cosmetic_id = $1`,
        [cosmeticID]
      );
      return rows[0].equip_group;
    } catch (error) {
      throw error;
    }
  },

  async getCosmeticsByRarity(rarity) {
    try {
      const { rows } = await query(
        `
        SELECT * FROM cosmetics
        WHERE rarity = $1
          AND cost > 0
          AND cosmetic_type != 'Chest'`,
        [rarity]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async getPurchaseableCosmetics() {
    try {
      const { rows } = await query(`SELECT * FROM cosmetics WHERE cost > 0`);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // A list of cosmetics that every player should have by default
  async getDefaultCosmetics() {
    try {
      const cosmeticNames = ["finisher_default", "terrain_default"];
      const cosmetics = [];
      for (const cosmetic of cosmeticNames) {
        const item = await this.getCosmeticByName(cosmetic);
        if (item) {
          cosmetics.push(item);
        }
      }
      return cosmetics;
    } catch (error) {
      throw error;
    }
  },

  // A list of cosmetic types that a player should never have more than one of
  // they can have more than one item in a type, but only of that specific item
  getUniqueCosmeticTypes() {
    return [
      "Avatar Frame",
      "Avatar Hat",
      "Avatar Accessory",
      "Card Frame",
      "Finisher",
      "Terrain",
    ];
  },

  isUniqueCosmetic(cosmeticType) {
    return this.getUniqueCosmeticTypes().includes(cosmeticType);
  },

  shouldAutoConsume(cosmetic) {
    if (cosmetic.cosmetic_type !== "Consumable") return false;
    if (cosmetic.cosmetic_name.includes("gold")) return true;
    if (cosmetic.cosmetic_name.includes("_xp_")) return true;
    if (cosmetic.cosmetic_name === "buy_bp") return true;
  },

  async createCosmetic(name, type, equipGroup, coins, cost, rarity) {
    try {
      const { rows } = await query(
        `
        INSERT INTO cosmetics (cosmetic_name, cosmetic_type, equip_group, cost_coins, cost_usd, rarity)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [name, type, equipGroup, coins, cost, rarity]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async updateCosmetic(
    cosmeticID,
    name,
    type,
    equipGroup,
    coins,
    cost,
    rarity
  ) {
    try {
      const { rows } = await query(
        `
        UPDATE cosmetics
        SET cosmetic_name = $1,
            cosmetic_type = $2,
            equip_group = $3,
            cost_coins = $4,
            cost_usd = $5,
            rarity = $6
        WHERE cosmetic_id = $7
        RETURNING *`,
        [name, type, equipGroup, coins, cost, rarity, cosmeticID]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async deleteAllCosmetics() {
    try {
      await query("DELETE FROM player_redeemed_codes");
      await query("DELETE FROM redemption_code_rewards");
      await query("DELETE FROM redemption_codes");
      await query("DELETE FROM drop_type_rewards");
      await query("DELETE FROM chest_drop_types");
      await query("DELETE FROM battle_pass_cosmetic_rewards");
      await query("DELETE FROM player_cosmetics");
      await query("DELETE FROM cosmetics");
    } catch (error) {
      throw error;
    }
  },

  async deleteCosmetic(cosmeticID) {
    try {
      await query(
        `DELETE FROM drop_type_rewards WHERE reward_cosmetic_id = $1`,
        [cosmeticID]
      );
      await query(`DELETE FROM chest_drop_types WHERE chest_cosmetic_id = $1`, [
        cosmeticID,
      ]);
      await query(
        `DELETE FROM battle_pass_cosmetic_rewards WHERE cosmetic_id = $1`,
        [cosmeticID]
      );
      await query(`DELETE FROM player_cosmetics WHERE cosmetic_id = $1`, [
        cosmeticID,
      ]);
      await query(`DELETE FROM cosmetics WHERE cosmetic_id = $1`, [cosmeticID]);
    } catch (error) {
      throw error;
    }
  },

  async bulkCreateCosmetics(cosmetics) {
    try {
      await tx.default(pool, async (db) => {
        for (const cosmetic of cosmetics) {
          const { rows } = await db.query(
            `SELECT * FROM cosmetics WHERE cosmetic_name = $1`,
            [cosmetic.name]
          );
          if (rows.length > 0)
            throw new Error(`Cosmetic ${cosmetic.name} already exists`);

          console.log(`Creating cosmetic ${cosmetic.name}...`);
          await db.query(
            `
            INSERT INTO cosmetics (cosmetic_name, cosmetic_type, equip_group, cost_coins, cost_usd, rarity)
            VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              cosmetic.name,
              cosmetic.type,
              cosmetic.equip_group,
              cosmetic.coins,
              cosmetic.cost_usd,
              cosmetic.rarity,
            ]
          );
        }
      });
    } catch (error) {
      throw error;
    }
  },

  // Initialize chests
  async addDropTypeRewards(dropType, rewardCosmeticID, cumSumOdds) {
    try {
      await query(
        `
      INSERT INTO drop_type_rewards (drop_type, reward_cosmetic_id, cum_sum_odds)
      VALUES ($1, $2, $3)
      RETURNING *`,
        [dropType, rewardCosmeticID, cumSumOdds]
      );
    } catch (error) {
      throw error;
    }
  },

  async addChestDropType(chestCosmeticID, dropType, cumSumOdds) {
    try {
      await query(
        `
      INSERT INTO chest_drop_types (chest_cosmetic_id, drop_type, cum_sum_odds)
      VALUES ($1, $2, $3)
      RETURNING *`,
        [chestCosmeticID, dropType, cumSumOdds]
      );
    } catch (error) {
      throw error;
    }
  },

  async clearChestDrops() {
    try {
      await query("DELETE FROM chest_drop_types");
      await query("DELETE FROM drop_type_rewards");
    } catch (error) {
      throw error;
    }
  },

  // --------------------------------------------------
  // Chests
  // --------------------------------------------------
  async getChestDropTypes(chestCosmeticID) {
    try {
      const { rows } = await query(
        `
      SELECT * FROM chest_drop_types
      WHERE chest_cosmetic_id = $1
      ORDER BY cum_sum_odds ASC`,
        [chestCosmeticID]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async getDropTypeRewards(dropType) {
    try {
      const { rows } = await query(
        `
        SELECT * FROM drop_type_rewards
        JOIN cosmetics ON cosmetic_id = reward_cosmetic_id
        WHERE drop_type = $1
        ORDER BY cum_sum_odds ASC`,
        [dropType]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async getRandomChestDropType(chestCosmeticID) {
    try {
      const dropTypes = await this.getChestDropTypes(chestCosmeticID);
      const roll = Math.random() * 100;
      for (const type of dropTypes) {
        if (roll <= type.cum_sum_odds) return type.drop_type;
      }
    } catch (error) {
      throw error;
    }
  },
};
